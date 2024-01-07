import { authors } from '../utils/constants';

export async function getPapers(author) {
  const apiUrl = 'https://api.adsabs.harvard.edu/v1/search/query';
  const apiToken = 'uuDw2qna1C55d2RhI9KahR47cv4X8zxMnPVqYOoR';

  const q = `(${authors.map(author => `author:"^${author}"`).join(' OR ')})
              AND pubdate:[2018-01-01 TO *] AND collection:astronomy`;

  const queryParams = {
    q,
    fl: 'title,bibcode,links,author,date',
    sort: 'date desc',
    rows: 20, // Set the desired number of rows here
  };

  // Convert query parameters to a URL-encoded string
  const queryString = new URLSearchParams(queryParams).toString();

  // Append query string to the API endpoint
  const fullUrl = `${apiUrl}?${queryString}`;

  // Instead of the file system,
  // fetch post data from an external API endpoint
  try {
    const res = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed with status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    // Handle the error gracefully, for example, you can return a default response
    return { error: 'Failed to fetch data from the API' };
  }
}