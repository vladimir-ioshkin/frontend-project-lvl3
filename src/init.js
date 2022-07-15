/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import { uniqueId, differenceBy } from 'lodash';
import { setLocale } from 'yup';
import i18n from 'i18next';
import getWatchedState from './render.js';
import resources from './locales/index.js';
import parseXML from './parser.js';

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

const validate = (url, feeds) => {
  const urls = getUrls(feeds);
  const schema = yup.string().url().required().notOneOf(urls);

  return schema.validate(url, { abortEarly: false });
};

const processUrl = (url, state) => {
  validate(url, state.feeds)
    .then(() => {
      state.messageCode = 'loading';
      return getPosts(url);
    })
    .then((response) => {
      const content = response.data.contents;
      const parsedContent = parseXML(content, url);
      const { feed, posts } = parsedContent;
      const feedId = uniqueId('feed_');
      const feedWithId = { ...feed, id: feedId };
      const postsWithId = posts.map((post) => ({ ...post, id: uniqueId('post_'), feedId }));
      state.messageCode = 'success';
      state.feeds.unshift(feedWithId);
      state.posts = [...postsWithId, ...state.posts];
    })
    .catch((err) => {
      if (err.isParsingError) {
        state.messageCode = 'errors.invalidRSS';
        return;
      }
      if (err.code === 'ERR_NETWORK') {
        state.messageCode = 'errors.networkError';
        return;
      }

      const error = err.errors[0];
      state.messageCode = error;
    });
};

const submitHandle = (e, state, elements) => {
  e.preventDefault();
  elements.inputEl.focus();
  const form = new FormData(elements.formEl);
  const url = form.get('url');
  processUrl(url, state);
};

const inputChangeHandle = (state) => {
  state.messageCode = null;
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
  const elements = {
    formEl: document.querySelector('form'),
    inputEl: document.querySelector('[name="url"]'),
    modalEl: document.querySelector('#modal'),
    postsList: document.querySelector('.posts ul'),
    feedsList: document.querySelector('.feeds ul'),
    postsCard: document.querySelector('.posts .card'),
    feedsCard: document.querySelector('.feeds .card'),
    submitBtn: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('.feedback'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalReadMore: document.querySelector('.full-article'),
  };

  setLocale({
    string: {
      url: 'errors.invalidUrl',
      required: 'errors.noUrl',
    },
    mixed: {
      notOneOf: 'errors.duplicatedUrl',
    },
  });

  const initialState = {
    lng: 'ru',
    feeds: [],
    posts: [],
    watchedPostId: null,
    visitedLinkIds: new Set(),
    messageCode: null,
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: initialState.lng,
    resources,
  })
    .then(() => {
      const state = getWatchedState(initialState, i18nInstance, elements);

      elements.formEl.addEventListener('submit', (e) => submitHandle(e, state, elements));
      elements.inputEl.addEventListener('input', () => inputChangeHandle(state));
      elements.modalEl.addEventListener('show.bs.modal', (e) => setWatchedPostId(e, state));
      elements.postsList.addEventListener('click', (e) => setLinkVisited(e, state));

      setTimeout(() => updatePosts(state), 5000);
    });
};

export default app;
