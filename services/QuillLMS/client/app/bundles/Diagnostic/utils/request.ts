// A lightweight convenience wrapper for the `request` module.
// This is just to centralize some of the common boilerplate for reuse.

import Raven from 'raven-js';
import request from 'request';

interface HttpStatusProps {
  statusCode: number;
}

function buildRequestCallback(success: (any) => void, error: (any) => void):
    (any, httpStatus: HttpStatusProps, body: object) => void {
  return (_, httpStatus, body) => {
    if (httpStatus && httpStatus.statusCode === 200) {
      success(body);
    } else {
      error(body);
    }
  };
}

function requestGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request.get({
      url: url,
      json: true,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestPost(url: string, data: Object): Promise<any> {
  return new Promise((resolve, reject) => {
    return request.post({
      url: url,
      json: data,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestPut(url: string, data: Object): Promise<any> {
  return new Promise((resolve, reject) => {
    return request.put({
      url: url,
      json: data,
    }, buildRequestCallback(resolve, reject));
  });
}

function requestDelete(url: string): Promise<any> {
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
