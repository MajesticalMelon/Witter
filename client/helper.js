export const handleError = (err) => {
  console.error(err);
  const error = document.getElementById('errorMessage');
  error.innerText = err;
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
export const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error || response.error) {
    handleError(result.error);
  } else {
    document.getElementById('errorMessage').innerText = '';
  }

  if (handler) {
    handler(result);
  }
};
