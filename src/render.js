/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const render = {
  renderModalContent(postId, posts, elements) {
    const post = posts.find(({ id }) => id === postId);

    elements.modalTitle.textContent = post.title;
    elements.modalDescription.textContent = post.description;
    elements.modalReadMore.setAttribute('href', post.link);
  },

  setLinkVisited(postId, elements) {
    const linkEl = elements.postsList.querySelector(`[data-id="${postId}"]`);
    linkEl.classList.remove('fw-bold');
    linkEl.classList.add('fw-normal');
  },

  renderFeeds(feeds, elements) {
    elements.formEl.reset();

    elements.feedsList.innerHTML = '';
    feeds.forEach(({ title, description }) => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      li.classList.add('list-group-item', 'border-0', 'border-end-0');

      h3.classList.add('h6', 'm-0');
      h3.textContent = title;

      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      li.append(h3);
      li.append(p);
      elements.feedsList.append(li);
    });

    if (feeds.length) {
      elements.feedsCard.classList.remove('d-none');
    } else {
      elements.feedsCard.classList.add('d-none');
    }
  },

  renderPosts(posts, visitedLinkIds, elements, i18nInstance) {
    elements.postsList.innerHTML = '';
    posts.forEach(({ id, title, link }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const btn = document.createElement('button');

      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      a.classList.add('fw-bold');
      a.target = '_blank';
      a.href = link;
      a.dataset.id = id;
      a.textContent = title;

      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.dataset.id = id;
      btn.textContent = i18nInstance.t('btnText');
      btn.dataset.bsToggle = 'modal';
      btn.dataset.bsTarget = '#modal';

      li.append(a);
      li.append(btn);
      elements.postsList.append(li);
      if (visitedLinkIds.has(id)) this.setLinkVisited(id, elements);
    });

    if (posts.length) {
      elements.postsCard.classList.remove('d-none');
    } else {
      elements.postsCard.classList.add('d-none');
    }
  },

  renderMessage(code, elements, i18nInstance) {
    elements.inputEl.className = 'form-control w-100';
    elements.feedbackEl.className = 'feedback m-0 position-absolute small';
    elements.submitBtn.removeAttribute('disabled');
    elements.inputEl.removeAttribute('disabled');

    if (code === null) {
      elements.feedbackEl.textContent = '';
      return;
    }

    elements.feedbackEl.textContent = i18nInstance.t(code);

    switch (code) {
      case 'loading':
        elements.submitBtn.setAttribute('disabled', 'true');
        elements.inputEl.setAttribute('disabled', 'true');
        break;

      case 'success':
        elements.feedbackEl.classList.add('text-success');
        break;

      case 'errors.invalidUrl':
      case 'errors.invalidRSS':
      case 'errors.duplicatedUrl':
      case 'errors.noUrl':
      case 'errors.networkError':
        elements.inputEl.classList.add('is-invalid');
        elements.feedbackEl.classList.add('text-danger');
        break;

      default:
        throw new Error(`Invalid code: "${code}"`);
    }
  },
};

const getWatchedState = (state, i18nInstance, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'feeds':
      render.renderFeeds(value, elements);
      break;
    case 'posts':
      render.renderPosts(value, state.visitedLinkIds, elements, i18nInstance);
      break;
    case 'watchedPostId':
      render.renderModalContent(value, state.posts, elements);
      break;
    case 'visitedLinkIds':
      render.setLinkVisited([...value].slice(-1), elements);
      break;
    case 'messageCode':
      render.renderMessage(value, elements, i18nInstance);
      break;
    default:
      throw new Error(`Invalid case: "${path}"`);
  }
});

export default getWatchedState;
