// A lightweight convenience wrapper for the fetch to handle security credentials.
// This is just to centralize some of the common boilerplate for reuse.

async function handleFetch({ url, method, success, error, payload, }: {url: string, method: string, success?: Function, error?: Function, payload?: object}): Promise<any> {
  let options = {
    method: method,
    cors: 'cors',
    credentials: 'include',
    headers: addCsrfHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  }

  if (payload) {
    options['body'] = JSON.stringify(payload)
  }

  const response = await fetch(fullyQualifiedUrl(url), options)
  const textResponse = await response.clone().text()

  const jsonResponse = textResponse.length ? await response.clone().json() : {};

  if (response.status === 303 && jsonResponse.redirect) {
    window.location.href = jsonResponse.redirect
  } else if (response.ok && success) {
    success(jsonResponse)
  } else if (!response.ok && error) {
    const jsonResponseWithErrorStatus = { ...jsonResponse, status: response.status, }
    error(jsonResponseWithErrorStatus)
  } else {
    const contentType = String(response.headers.get('content-type'))
    if (contentType.startsWith('application/json;')) {
      return jsonResponse
    }
    return textResponse
  }
}

// Build a fully-qualified URL if we're only passed a path
function fullyQualifiedUrl(url) {
  // solution from here: https://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
  const fullUrlTest = new RegExp('^(?:[a-z+]+:)?//', 'i');
  if (fullUrlTest.test(url)) {
    return url;
  }
  return `${import.meta.env.VITE_DEFAULT_URL}${url}`;
}

function addCsrfHeaders(headers = {}) {
  const csrfElement = document.querySelector("meta[name='csrf-token']");
  const csrfToken = csrfElement ? csrfElement.getAttribute('content') : '';
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }
  return headers;
}

function requestGet(url: string, success?: Function, error?: Function) {
  return handleFetch({ url, method: 'get', success, error})
}

function requestPost(url: string, payload?: any, success?: Function, error?: Function) {
  return handleFetch({ url, method: 'post', success, error, payload, })
}

function requestPut(url: string, payload?: any, success?: Function, error?: Function) {
  return handleFetch({ url, method: 'put', success, error, payload, })
}

function requestDelete(url: string, payload?: any, success?: Function, error?: Function) {
  return handleFetch({ url, method: 'delete', success, error, payload, })
}

export {
  requestGet,
  requestPost,
  requestPut,
  requestDelete
};
