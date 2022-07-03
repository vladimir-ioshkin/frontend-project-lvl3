/* eslint-disable no-param-reassign */
import { uniqueId, differenceBy } from 'lodash';
import getPosts from './getPosts.js';
import parseXML from './parser.js';

const updatePosts = (state) => {
  const promises = state.feeds.map(({ link }) => getPosts(link));
  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        const { data: { status: { url } } } = response;
        const { id } = state.feeds.find((feed) => feed.link === url);
        const currentPosts = state.posts.filter((post) => post.feedId === id);
        const content = response.data.contents;
        const parsedContent = parseXML(content, url);
        const newPosts = differenceBy(parsedContent.posts, currentPosts, 'link');
        const newPostsWithIds = newPosts.map((post) => ({
          id: uniqueId('post_'),
          feedId: id,
          ...post,
        }));

        state.posts = [...newPostsWithIds, ...state.posts];
      });
    })
    .finally(() => setTimeout(() => updatePosts(state), 5000));
};

export default updatePosts;
