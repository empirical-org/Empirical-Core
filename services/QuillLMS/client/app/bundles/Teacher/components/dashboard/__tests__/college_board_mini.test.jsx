import React from 'react';
import { mount } from 'enzyme';

import CollegeBoardMini from '../college_board_mini';

describe('CollegeBoardMini component', () => {

  it('should render', () => {
    expect(mount(<CollegeBoardMini />)).toMatchSnapshot();
  });

});
