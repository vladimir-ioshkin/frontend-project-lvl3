/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  string: {
    url: 'errors.invalidUrl',
  },
  mixed: {
    notOneOf: 'errors.duplicatedUrl',
  },
});

const validate = (url, state, i18nInstance) => {
  const schema = yup.string().url().required().notOneOf(state.feeds);

  schema.validate(url, { abortEarly: false })
    .then(() => {
      state.feeds.push(url);
    })
    .catch((err) => {
      const error = err.errors[0];
      state.formError = i18nInstance.t(error);
    });
};

export default validate;
