import { shallow } from 'enzyme';
import React from 'react';

import KeyTargetSkillConcept from '../key_target_skill_concept';

describe('KeyTargetSkillConcept component', () => {
  const wrapper = shallow(
    <KeyTargetSkillConcept
      correct={7}
      incorrect={3}
      name='Cool Concept'
    />
  );


  it('should render name, number correct, and number incorrect', () => {
    expect(wrapper.text()).toMatch('Cool Concept');
    expect(wrapper.find('.correct-answer').text()).toMatch('7');
    expect(wrapper.find('.incorrect-answer').text()).toMatch('3');
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot()
  })

});
