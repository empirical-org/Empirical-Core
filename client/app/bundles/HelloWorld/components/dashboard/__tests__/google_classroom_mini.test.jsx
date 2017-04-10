import React from 'react';
import { shallow } from 'enzyme';

import GoogleClassroomMini from '../google_classroom_mini';

describe('GoogleClassroomMini component', () => {

  it('should render', () => {
    expect(shallow(<GoogleClassroomMini />)).toMatchSnapshot();
  });

});
