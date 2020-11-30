import * as React from 'react';
import { shallow } from 'enzyme';

import { TurkCompleted } from '../completed';

describe('TurkCompleted Component', () => {
  Object.defineProperty(global.document, 'queryCommandSupported', { value: jest.fn() });
  const component = shallow(<TurkCompleted code='saideira-maracuja' />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
