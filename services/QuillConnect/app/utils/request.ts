// A lightweight convenience wrapper for the `request` module.
// This is just to centralize some of the common boilerplate for reuse.

import request from 'request';


function buildRequestCallback(success: (string) => void, error: (string) => void): (any, object, string) => void {
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

function requestGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    request.get({
      url: url,
      json: true,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestPost(url: string, data: Object): Promise<string> {
  return new Promise((resolve, reject) => {
    return request.post({
      url: url,
      json: data,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestPut(url: string, data: Object): Promise<string> {
  return new Promise((resolve, reject) => {
    return request.put({
      url: url,
      json: data,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestDelete(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    return request.delete({
      url: url,
      json: true,
    }, buildRequestCallback(resolve, reject));
  });
}

export {
  requestGet,
  requestPost,
  requestPut,
  requestDelete
};
