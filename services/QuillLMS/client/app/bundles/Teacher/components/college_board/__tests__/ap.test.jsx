import * as React from 'react';
import { mount } from 'enzyme';

import Ap from '../ap';

describe('Ap component', () => {

  it('should render when it is part of the assignment flow', () => {
    expect(mount(<Ap isPartOfAssignmentFlow={true} />)).toMatchSnapshot();
  });

  it('should render when it is not part of the assignment flow', () => {
    expect(mount(<Ap />)).toMatchSnapshot();
  });

});
