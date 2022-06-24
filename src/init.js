/* eslint-disable no-param-reassign */
import i18n from 'i18next';
import getWatchedState from './getWatchedState.js';
import validate from './validate.js';
import resources from './locales/index.js';
import updatePosts from './updatePosts.js';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');
const modalEl = document.querySelector('#modal');
const postsList = document.querySelector('.posts ul');

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
