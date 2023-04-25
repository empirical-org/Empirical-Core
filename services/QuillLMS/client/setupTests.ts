import * as Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import 'whatwg-fetch';

configure({ adapter: new Adapter() });

Object.defineProperty(document, 'fonts', {
  value: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
});
