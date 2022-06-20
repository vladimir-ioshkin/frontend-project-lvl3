const parseXML = (content, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'application/xml');
  const errorNode = doc.querySelector('parsererror');

  if (errorNode) {
    const error = new Error('Fail XML parsing');
    error.isParsingError = true;
    throw error;
  }

  const feed = {
    title: '',
    description: '',
    link: url,
  };
  const posts = [];

  try {
    const channel = doc.querySelector('channel');
    const items = channel.querySelectorAll('item');

    feed.title = channel.querySelector('title').textContent;
    feed.description = channel.querySelector('description').textContent;

    items.forEach((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;

      posts.push({
        title,
        link,
        description,
      });
    });

    return { feed, posts };
  } catch {
    const error = new Error('Fail XML parsing');
    error.isParsingError = true;
    throw error;
  }
};

export default parseXML;
