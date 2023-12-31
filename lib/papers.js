export async function getPapers() {
  //const apiUrl = 'https://api.adsabs.harvard.edu/v1/search/query?';
  const apiUrl = 'https://api.adsabs.harvard.edu/v1/search/query?q=author%3A%5Ehuertas-company&fl=title%2C+bibcode';
  const apiToken = 'uuDw2qna1C55d2RhI9KahR47cv4X8zxMnPVqYOoR';

  const queryParams = {
      author: 'angeloudi',
      fl: 'title,bibcode',
  };

  // Convert query parameters to a URL-encoded string
  const queryString = new URLSearchParams(queryParams).toString();

  // Append query string to the API endpoint
  const fullUrl = `${apiUrl}?${queryString}`;


  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
        });
  console.log('API Response:', res);
  return res.json();
}

