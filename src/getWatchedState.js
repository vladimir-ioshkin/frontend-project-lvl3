import onChange from 'on-change';
import render from './render.js';

const getWatchedState = (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      render.renderFeeds(value);
      break;
    case 'posts':
      render.renderPosts(value, state.visitedLinkIds);
      break;
    case 'watchedPostId':
      render.renderModalContent(value, state.posts);
      break;
    case 'visitedLinkIds':
      render.setLinkVisited([...value].slice(-1));
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
