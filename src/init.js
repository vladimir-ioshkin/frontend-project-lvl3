/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import { uniqueId, differenceBy } from 'lodash';
import { setLocale } from 'yup';
import i18n from 'i18next';
import getWatchedState from './render.js';
import resources from './locales/index.js';
import parseXML from './parser.js';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');
const modalEl = document.querySelector('#modal');
const postsList = document.querySelector('.posts ul');

setLocale({
  string: {
    url: 'errors.invalidUrl',
    required: 'errors.noUrl',
  },
  mixed: {
    notOneOf: 'errors.duplicatedUrl',
  },
});

const getUrls = (feeds) => feeds.map(({ link }) => link);
const getProxyUrl = (url) => {
  const path = 'https://allorigins.hexlet.app/get';
  const params = new URLSearchParams({
    url,
    disableCache: true,
  });
  const proxyUrl = new URL(`${path}?${params}`);

  return proxyUrl.href;
};

const getPosts = (url) => axios.get(getProxyUrl(url));

const updatePosts = (state) => {
  const promises = state.feeds.map(({ link }) => getPosts(link));
  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        const { data: { status: { url } } } = response;
        const { id } = state.feeds.find((feed) => feed.link === url);
        const currentPosts = state.posts.filter((post) => post.feedId === id);
        const content = response.data.contents;
        const parsedContent = parseXML(content, url);
        const newPosts = differenceBy(parsedContent.posts, currentPosts, 'link');
        const newPostsWithIds = newPosts.map((post) => ({
          id: uniqueId('post_'),
          feedId: id,
          ...post,
        }));

        state.posts = [...newPostsWithIds, ...state.posts];
      });
    })
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

const validate = (url, state, i18nInstance) => {
  const urls = getUrls(state.feeds);
  const schema = yup.string().url().required().notOneOf(urls);

  schema.validate(url, { abortEarly: false })
    .then(() => {
      state.isLoading = true;
      return getPosts(url);
    })
    .then((response) => {
      const content = response.data.contents;
      const parsedContent = parseXML(content, url);
      const { feed, posts } = parsedContent;
      const feedId = uniqueId('feed_');
      const feedWithId = { ...feed, id: feedId };
      const postsWithId = posts.map((post) => ({ ...post, id: uniqueId('post_'), feedId }));
      state.successMessage = i18nInstance.t('succsess');
      state.feeds.unshift(feedWithId);
      state.posts = [...postsWithId, ...state.posts];
    })
    .catch((err) => {
      if (err.isParsingError) {
        state.errorMessage = i18nInstance.t('errors.invalidRSS');
        return;
      }
      if (err.code === 'ERR_NETWORK') {
        state.errorMessage = i18nInstance.t('errors.networkError');
        return;
      }

      const error = err.errors[0];
      state.errorMessage = i18nInstance.t(error);
    })
    .finally(() => {
      state.isLoading = false;
    });
};

const submitHandle = (e, state, i18nInstance) => {
  e.preventDefault();
  inputEl.focus();
  const form = new FormData(formEl);
  const url = form.get('url');
  validate(url, state, i18nInstance);
};

const inputChangeHandle = (state) => {
  state.errorMessage = null;
  state.successMessage = null;
};

const setWatchedPostId = (e, state) => {
  const postId = e.relatedTarget.dataset.id;
  state.watchedPostId = postId;
  state.visitedLinkIds.add(postId);
};

const setLinkVisited = (e, state) => {
  const { target } = e;
  if (target.tagName !== 'A') return;
  state.visitedLinkIds.add(target.dataset.id);
};

const app = () => {
  const initialState = {
    lng: 'ru',
    feeds: [],
    posts: [],
    watchedPostId: null,
    visitedLinkIds: new Set(),
    errorMessage: null,
    successMessage: null,
    isLoading: false,
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: initialState.lng,
    resources,
  })
    .then(() => {
      const state = getWatchedState(initialState, i18nInstance);
      inputEl.focus();

      formEl.addEventListener('submit', (e) => submitHandle(e, state, i18nInstance));
      inputEl.addEventListener('input', () => inputChangeHandle(state));
      modalEl.addEventListener('show.bs.modal', (e) => setWatchedPostId(e, state));
      postsList.addEventListener('click', (e) => setLinkVisited(e, state));

      setTimeout(() => updatePosts(state), 5000);
    });
};

export default app;
