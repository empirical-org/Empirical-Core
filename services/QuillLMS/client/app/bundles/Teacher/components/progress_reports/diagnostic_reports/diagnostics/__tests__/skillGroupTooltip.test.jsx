import { mount } from 'enzyme'
import React from 'react'

import SkillGroupTooltip from '../skillGroupTooltip'

describe('SkillGroupTooltip component', () => {
  it('should render', () => {
    const wrapper = mount(<SkillGroupTooltip
      description='Students who show proficiency in this skill will use capitalization at the beginning of a sentence and correct capitalization of names, dates, holidays, geographic locations, and the pronoun "I."'
      name="Capitalization"
    />)
    expect(wrapper).toMatchSnapshot()
  })

})
