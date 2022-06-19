import onChange from 'on-change';

const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');
const feedbackEl = document.querySelector('.feedback');

const getWatchedState = (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      formEl.reset();
      break;
    case 'formError':
      if (value) {
        inputEl.classList.add('is-invalid');
        feedbackEl.textContent = value;
        return;
      }
      inputEl.classList.remove('is-invalid');
      feedbackEl.textContent = '';
      break;
    default:
      throw new Error('invalid case');
  }
});

export default getWatchedState;
