import * as React from 'react';
import { mount } from 'enzyme';

import SpringBoard from '../spring_board';

describe('Ap component', () => {

  it('should render when it is part of the assignment flow', () => {
    expect(mount(<SpringBoard isPartOfAssignmentFlow={true} />)).toMatchSnapshot();
  });

  it('should render when it is not part of the assignment flow', () => {
    expect(mount(<SpringBoard />)).toMatchSnapshot();
  });

});
