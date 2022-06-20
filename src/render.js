const postsList = document.querySelector('.posts ul');
const feedsList = document.querySelector('.feeds ul');
const formEl = document.querySelector('form');
const inputEl = formEl.querySelector('[name="url"]');
const submitBtn = formEl.querySelector('button');
const feedbackEl = document.querySelector('.feedback');

const render = {
  renderFeeds(feeds) {
    formEl.reset();
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
      feedsList.append(li);
    });
  },

  renderPosts(posts) {
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
      btn.textContent = 'Просмотр';
      btn.dataset.bsToggle = 'modal';
      btn.dataset.bsTarget = '#modal';

      li.append(a);
      li.append(btn);
      postsList.append(li);
    });
  },

  renderErrorMessage(text) {
    if (text) {
      inputEl.classList.add('is-invalid');
      feedbackEl.classList.add('text-danger');
      feedbackEl.textContent = text;
      return;
    }
    feedbackEl.classList.remove('text-danger');
    inputEl.classList.remove('is-invalid');
    feedbackEl.textContent = '';
  },

  renderSuccessMessage(text) {
    if (text) {
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = text;
      return;
    }
    feedbackEl.classList.remove('text-success');
    feedbackEl.textContent = '';
  },

  renderLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.setAttribute('disabled', 'true');
    } else {
      submitBtn.removeAttribute('disabled');
    }
  },
};

export default render;
