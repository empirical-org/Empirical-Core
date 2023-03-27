import { mount } from 'enzyme';
import * as React from 'react';

import FinishSetUp from '../finish_set_up';

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
}))

describe('FinishSetUp component', () => {
  const props = {
    email: 'emilia@quill.org',
    firstName: 'Emilia',
    lastName: 'Friedberg',
    token: 'token',
  };

  it('should render', () => {
    const component = mount(<FinishSetUp {...props} />);
    expect(component).toMatchSnapshot();
  });

});
