// A lightweight convenience wrapper for the fetch to handle security credentials.
// This is just to centralize some of the common boilerplate for reuse.

async function handleFetch(url: string, method: string, success: Function, error: Function, payload?: object): Promise<any> {
  let options = {
    method: method,
    cors: 'cors',
    credentials: 'include'
  }
  if (payload) {
    options['headers'] = addCsrfHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
    options['body'] = JSON.stringify(payload)
  }
  const response = await fetch(fullyQualifiedUrl(url), options)

  const jsonResponse = await response.json();

  if (response.status === 303 && jsonResponse.redirect) {
    window.location.href = jsonResponse.redirect
  } else if (response.ok) {
    success(jsonResponse)
  } else {
    error(jsonResponse)
  }
}

function fullyQualifiedUrl(url) {
  // Build a fully-qualified URL if we're only passed a path
  if (!url.includes(process.env.DEFAULT_URL)) {
    return `${process.env.DEFAULT_URL}${url}`;
  }
  return url;
}

function addCsrfHeaders(headers = {}) {
  const csrfElement = document.querySelector("meta[name='csrf-token']");
  const csrfToken = csrfElement ? csrfElement.getAttribute('content') : '';
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }
  return headers;
}

function requestGet(url, success, error) {
  return handleFetch(url, 'get', success, error)
}

function requestPost(url, data, success, error) {
  return handleFetch(url, 'post', success, error, data)
}

function requestPut(url, data, success, error) {
  return handleFetch(url, 'put', success, error, data)
}

function requestDelete(url, data, success, error) {
  return handleFetch(url, 'delete', success, error, data)
}

export {
  requestGet,
  requestPost,
  requestPut,
  requestDelete
};
