/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { setLocale } from 'yup';
import { uniqueId } from 'lodash';
import getPosts from './getPosts.js';
import parseXML from './parser.js';

setLocale({
  string: {
    url: 'errors.invalidUrl',
    required: 'errors.noUrl',
  },
  mixed: {
    notOneOf: 'errors.duplicatedUrl',
  },
});

const getUrls = (feeds) => feeds.map(({ link }) => link);

const validate = (url, state, i18nInstance) => {
  const urls = getUrls(state.feeds);
  const schema = yup.string().url().required().notOneOf(urls);

  schema.validate(url, { abortEarly: false })
    .then(() => {
      state.isLoading = true;
      return getPosts(url);
    })
    .then((response) => {
      const content = response.data.contents;
      const parsedContent = parseXML(content, url);
      const { feed, posts } = parsedContent;
      const feedId = uniqueId('feed_');
      const feedWithId = { ...feed, id: feedId };
      const postsWithId = posts.map((post) => ({ ...post, id: uniqueId('post_'), feedId }));
      state.isLoading = false;
      state.successMessage = i18nInstance.t('succsess');
      state.feeds.unshift(feedWithId);
      state.posts = [...postsWithId, ...state.posts];
    })
    .catch((err) => {
      if (err.isParsingError) {
        state.errorMessage = i18nInstance.t('errors.invalidRSS');
        return;
      }
      if (err.code === 'ERR_NETWORK') {
        state.errorMessage = i18nInstance.t('errors.networkError');
        return;
      }

      const error = err.errors[0];
      state.errorMessage = i18nInstance.t(error);
    });
};

export default validate;
