/* eslint-disable no-param-reassign */
import * as yup from 'yup';

const validate = (url, state) => {
  const schema = yup.string().url().required().notOneOf(state.feeds);

  schema.validate(url, { abortEarly: false })
    .then(() => {
      state.feeds.push(url);
    })
    .catch(({ errors: [error] }) => {
      state.formError = error;
    });
};

export default validate;
