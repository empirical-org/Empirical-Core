import * as React from 'react';
import { shallow } from 'enzyme';

import { NavBar } from '../NavBar';

describe('NavBar Component', () => {
  const component = shallow(<NavBar />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
