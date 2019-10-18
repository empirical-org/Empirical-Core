import * as React from 'react';
import { shallow } from 'enzyme';

import AssignANewActivity from '../assign_a_new_activity';

describe('AssignANewActivity component', () => {

  it('should render', () => {
    expect(shallow(<AssignANewActivity />)).toMatchSnapshot();
  });

});
