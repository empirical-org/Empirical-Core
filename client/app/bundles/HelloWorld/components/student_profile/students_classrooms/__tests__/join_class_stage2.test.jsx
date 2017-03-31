import React from 'react';
import { shallow } from 'enzyme';

import JoinClassStage2 from '../join_class_stage2';

describe('JoinClassStage2 component', () => {

  it('should render success state', () => {
    const wrapper = shallow(<JoinClassStage2 />);
    expect(wrapper).toMatchSnapshot();
  });

});
