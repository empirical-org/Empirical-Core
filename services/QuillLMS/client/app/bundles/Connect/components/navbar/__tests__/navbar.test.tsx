import { shallow } from 'enzyme';
import * as React from 'react';

import { NavBar } from '../navbar';

describe('NavBar Component', () => {
  const component = shallow(<NavBar />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
