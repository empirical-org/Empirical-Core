import React from 'react';
import { shallow } from 'enzyme';

import LaunchingSoonMini from '../launching_soon_mini';

describe('LaunchingSoonMini component', () => {

  it('should render', () => {
    expect(shallow(<LaunchingSoonMini />)).toMatchSnapshot();
  });

});
