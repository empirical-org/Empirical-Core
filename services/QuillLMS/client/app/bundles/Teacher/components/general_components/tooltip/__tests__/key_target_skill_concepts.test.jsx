import { mount } from 'enzyme';
import React from 'react';

import KeyTargetSkillConcepts from '../key_target_skill_concepts';

const groupedKeyTargetSkillConcepts = [
  {
    name: 'Conventions of Language',
    correct: 1,
    incorrect: 7,
  },
  {
    name: 'Subordinating Conjunctions',
    correct: 0,
    incorrect: 3
  }
]

describe('KeyTargetSkillConcepts component', () => {
  const wrapper = mount(<KeyTargetSkillConcepts groupedKeyTargetSkillConcepts={groupedKeyTargetSkillConcepts} />)

  it('should render', () => {
    expect(wrapper).toMatchSnapshot()
  })
});
