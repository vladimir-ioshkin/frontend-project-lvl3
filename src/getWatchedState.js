import onChange from 'on-change';
import render from './render.js';

const getWatchedState = (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      render.renderFeeds(value);
      break;
    case 'posts':
      render.renderPosts(value);
      break;
    case 'errorMessage':
      render.renderErrorMessage(value);
      break;
    case 'successMessage':
      render.renderSuccessMessage(value);
      break;
    case 'isLoading':
      break;
    default:
      throw new Error('invalid case');
  }
});

export default getWatchedState;
