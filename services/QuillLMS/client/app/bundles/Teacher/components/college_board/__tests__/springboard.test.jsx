import { mount } from 'enzyme';
import * as React from 'react';

import { units } from './data';

import SpringBoard from '../spring_board';

describe('SpringBoard component', () => {

  it('should render when it is part of the assignment flow', () => {
    expect(mount(<SpringBoard isPartOfAssignmentFlow={true} units={units} />)).toMatchSnapshot();
  });

  it('should render when it is not part of the assignment flow', () => {
    expect(mount(<SpringBoard units={units} />)).toMatchSnapshot();
  });

});
