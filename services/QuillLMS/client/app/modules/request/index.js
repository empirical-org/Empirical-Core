// A lightweight convenience wrapper for the `request` module.
// This is just to centralize some of the common boilerplate for reuse.

import request from 'request';


function fullyQualifiedUrl(url) {
  // Build a fully-qualified URL if we're only passed a path
  if (!url.includes(process.env.DEFAULT_URL)) {
    return `${process.env.DEFAULT_URL}${url}`;
  }
  return url;
}

function buildRequestCallback(success, error) {
  return (_, httpStatus, body) => {
    if (httpStatus && httpStatus.statusCode === 200) {
      if (success) {
        success(body);
      }
    } else if (httpStatus && httpStatus.statusCode === 303 && body.redirect) {
      window.location.href = body.redirect
    }
    else {
      if (error) {
        error(body);
      } else {
        // Default error handling if nothing is provided
        // to do, use Sentry to capture error
      }
    }
  };
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
  return request.get({
    url: fullyQualifiedUrl(url),
    json: true,
  }, buildRequestCallback(success, error));
}

function requestPost(url, data, success, error) {
  return request.post({
    url: fullyQualifiedUrl(url),
    json: data,
    headers: addCsrfHeaders(),
  }, buildRequestCallback(success, error));
}

function requestPut(url, data, success, error) {
  return request.put({
    url: fullyQualifiedUrl(url),
    json: data,
    headers: addCsrfHeaders(),
  }, buildRequestCallback(success, error));
}

function requestDelete(url, data, success, error) {
  return request.delete({
    url: fullyQualifiedUrl(url),
    json: data,
    headers: addCsrfHeaders(),
  }, buildRequestCallback(success, error));
}

export {
  requestGet,
  requestPost,
  requestPut,
  requestDelete
};
