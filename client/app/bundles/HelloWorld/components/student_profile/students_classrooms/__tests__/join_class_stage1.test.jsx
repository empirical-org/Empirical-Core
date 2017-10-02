import React from 'react';
import { shallow } from 'enzyme';

import JoinClassStage1 from '../join_class_stage1';

describe('JoinClassStage1 component', () => {

  it('should render fields to add new class', () => {
    const wrapper = shallow(<JoinClassStage1 />);
    expect(wrapper.find('input.class-input').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('should render any errors in state', () => {
    const wrapper = shallow(<JoinClassStage1 />);
    expect(wrapper.find('.error-message').exists()).toBe(false);
    wrapper.setState({error: 'Oh no!'})
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toBe('Oh no!');
  });

});
