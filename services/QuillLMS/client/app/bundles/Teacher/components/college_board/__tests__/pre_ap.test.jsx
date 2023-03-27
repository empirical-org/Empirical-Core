import { mount } from 'enzyme';
import * as React from 'react';

import { units } from './data';

import PreAp from '../pre_ap';

describe('PreAp component', () => {

  it('should render when it is part of the assignment flow', () => {
    expect(mount(<PreAp isPartOfAssignmentFlow={true} units={units} />)).toMatchSnapshot();
  });

  it('should render when it is not part of the assignment flow', () => {
    expect(mount(<PreAp units={units} />)).toMatchSnapshot();
  });

  it('should render with no units', () => {
    expect(mount(<PreAp isPartOfAssignmentFlow={true} />)).toMatchSnapshot();
  })

});
