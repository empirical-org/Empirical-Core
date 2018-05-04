import React from 'react';
import { shallow } from 'enzyme';

import JoinClass from '../JoinClass.jsx';

describe('JoinClass container', () => {
  const wrapper = shallow(<JoinClass />);

  it('should have an initial stage of 1', () => {
    expect(wrapper.state().stage).toBe(1);
  });

  it('should render JoinClass1 component if stage is 1', () => {
    wrapper.setState({stage: 1});
    expect(wrapper.find(JoinClassStage1).exists()).toBe(true);
  });

  it('should render JoinClass2 component if stage is not 1', () => {
    wrapper.setState({stage: 2});
    expect(wrapper.find(JoinClassStage2).exists()).toBe(true);
  });

  it('should set stage to 2 if advanceStage is called', () => {
    wrapper.setState({stage: 'not 2'});
    wrapper.instance().advanceStage();
    expect(wrapper.state().stage).toBe(2);
  });

});
