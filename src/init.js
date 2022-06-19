/* eslint-disable no-param-reassign */
import 'bootstrap';
import getWatchedState from './getWatchedState.js';
import validate from './validate.js';

const submitHandle = (e, state) => {
  e.preventDefault();
  const formEl = document.querySelector('form');
  const inputEl = formEl.querySelector('[name="url"]');
  inputEl.focus();
  const form = new FormData(formEl);
  const url = form.get('url');
  validate(url, state);
};

const inputChangeHandle = (state) => {
  state.formError = null;
};

const app = () => {
  const initialState = {
    feeds: [],
    formError: null,
  };

  const state = getWatchedState(initialState);

  const formEl = document.querySelector('form');
  const inputEl = formEl.querySelector('[name="url"]');
  inputEl.focus();

  formEl.addEventListener('submit', (e) => submitHandle(e, state));
  inputEl.addEventListener('input', () => inputChangeHandle(state));
};

export default app;
