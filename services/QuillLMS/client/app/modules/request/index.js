// A lightweight convenience wrapper for the `request` module.
// This is just to centralize some of the common boilerplate for reuse.

import request from 'request';


function _fullyQualifiedUrl(url) {
  // Build a fully-qualified URL if we're only passed a path
  if (!url.includes(process.env.DEFAULT_URL)) {
    return `${process.env.DEFAULT_URL}${url}`;
  }
  return url;
}

function _buildRequestCallback(success, error) {
  return (_, httpStatus, body) => {
    if (httpStatus && httpStatus.statusCode === 200) {
      if (success) {
        success(body);
      }
    } else {
      if (error) {
        error(body);
      } else {
        // Default error handling if nothing is provided
        console.error(body);
      }
    }
  };
}

function _addCsrfHeaders(headers = {}) {
  const csrfElement = document.querySelector("meta[name='csrf-token']");
  const csrfToken = csrfElement ? csrfElement.getAttribute('content') : '';
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }
  return headers;
}

function requestGet(url, success, error) {
  return request.get({
    url: _fullyQualifiedUrl(url),
    json: true,
  }, _buildRequestCallback(success, error));
}

function requestPost(url, data, success, error) {
  return request.post({
    url: _fullyQualifiedUrl(url),
    json: data,
    headers: _addCsrfHeaders(),
  }, _buildRequestCallback(success, error));
}

export {
  requestGet,
  requestPost,
};
