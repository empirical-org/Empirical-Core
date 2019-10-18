import * as React from 'react';
import { shallow } from 'enzyme';

import LearningProcess from '../learning_process';

describe('LearningProcess component', () => {

  it('should render', () => {
    expect(shallow(<LearningProcess />)).toMatchSnapshot();
  });

});
