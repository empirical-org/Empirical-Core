import React from 'react';
import { shallow } from 'enzyme';

import NewToolsMini from '../new_tools_mini';

describe('NewToolsMini component', () => {

  // Update this snapshot whenever we update the NewToolsMini.
  it('should render', () => {
    expect(shallow(<NewToolsMini />)).toMatchSnapshot();
  });

});
