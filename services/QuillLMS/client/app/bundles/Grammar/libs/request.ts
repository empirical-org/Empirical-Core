// A lightweight convenience wrapper for the fetch to handle security credentials.
// This is just to centralize some of the common boilerplate for reuse.

async function handleFetch(url: string, method: string, payload?: object): Promise<any> {
  let options = {
    method: method,
    cors: 'cors',
    credentials: 'include',
  }
  if (payload) {
    options['headers'] = {
      'Content-Type': 'application/json',
    }
    options['body'] = JSON.stringify(payload)
  }
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw response
    }

    if (response.headers === null) {
      return ""
    }

    const contentType = String(response.headers.get('content-type'))

    if (contentType.startsWith('application/json;')) {
      return response.json()
    }
    return response.text()
  })
}

function requestGet(url: string): Promise<any> {
  return handleFetch(url, 'GET')
}

function requestPost(url: string, data: Object): Promise<any> {
  return handleFetch(url, 'POST', data)
}

function requestPut(url: string, data: Object): Promise<any> {
  return handleFetch(url, 'PUT', data)
}

function requestDelete(url: string): Promise<any> {
  return handleFetch(url, 'DELETE')
}

export {
  requestGet,
  requestPost,
  requestPut,
  requestDelete
};
