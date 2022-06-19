/* eslint-disable no-param-reassign */
import i18n from 'i18next';
import getWatchedState from './getWatchedState.js';
import validate from './validate.js';
import resources from './locales/index.js';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');

const submitHandle = (e, state, i18nInstance) => {
  e.preventDefault();
  inputEl.focus();
  const form = new FormData(formEl);
  const url = form.get('url');
  validate(url, state, i18nInstance);
};

const inputChangeHandle = (state) => {
  state.formError = null;
};

const app = () => {
  const initialState = {
    lng: 'ru',
    feeds: [],
    formError: null,
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: initialState.lng,
    resources,
  })
    .then(() => {
      const state = getWatchedState(initialState);
      inputEl.focus();

      formEl.addEventListener('submit', (e) => submitHandle(e, state, i18nInstance));
      inputEl.addEventListener('input', () => inputChangeHandle(state));
    });
};

export default app;
