import { mount } from 'enzyme'
import React from 'react'

import SkillsTable from '../skillsTable'

const skillGroup = {"skill_group":"Prepositional Phrases","description":"Students who show proficiency in this skill will correctly place a prepositional phrase, agree the subject to the verb with a prepositional phrase, and correctly place adjectives, adverbs, and prepositional phrases together.","skills":[{"id":128,"skill":"Adjectives, Adverbs, & Prepositional Phrases","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},{"id":127,"skill":"Prepositional Phrases","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},{"id":126,"skill":"Subject-Verb Agreement","number_correct":2,"number_incorrect":1,"summary":"Partially correct"}],"number_of_correct_skills_text":"2 of 3 skills correct","proficiency_text":"Partial proficiency","id":66}

describe('SkillsTable component', () => {
  it('should render when it is not expandable', () => {
    const wrapper = mount(<SkillsTable
      isExpandable={false}
      skillGroup={skillGroup}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is expandable', () => {
    const wrapper = mount(<SkillsTable
      isExpandable={true}
      skillGroup={skillGroup}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
