import axios from 'axios';

const getProxyUrl = (url) => `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;

const getPosts = (url) => axios.get(getProxyUrl(url));

export default getPosts;
