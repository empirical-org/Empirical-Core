import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import 'whatwg-fetch';

import processEnvMock from './__mocks__/processEnvMock';

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
