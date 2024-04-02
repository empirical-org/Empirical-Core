import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import 'whatwg-fetch';

import processEnvMock from './__mocks__/processEnvMock';
import * as requestsApi from './app/modules/request';

configure({ adapter: new Adapter() });

Object.defineProperty(document, 'fonts', {
  value: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

window.process.env = processEnvMock.env

window.scrollTo = jest.fn();

const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation(() =>  new Promise(jest.fn()))
const requestPutSpy = jest.spyOn(requestsApi, 'requestPut').mockImplementation(() => new Promise(jest.fn()))
const requestPostSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => new Promise(jest.fn()))
const requestDeleteSpy = jest.spyOn(requestsApi, 'requestDelete').mockImplementation(() => new Promise(jest.fn()))
