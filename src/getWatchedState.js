import onChange from 'on-change';

const getWatchedState = (state) => onChange(state, (path, value) => {
  const formEl = document.querySelector('form');
  const inputEl = formEl.querySelector('[name="url"]');

  switch (path) {
    case 'feeds':
      formEl.reset();
      break;
    case 'formError':
      if (value) {
        inputEl.classList.add('is-invalid');
        return;
      }
      inputEl.classList.remove('is-invalid');
      break;
    default:
      throw new Error('invalid case');
  }
});

export default getWatchedState;
