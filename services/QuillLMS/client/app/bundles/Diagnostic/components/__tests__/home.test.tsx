import * as React from 'react';
import { shallow } from 'enzyme';

import { Home } from '../home';

describe('Home Component', () => {
  const component = shallow(<Home />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
