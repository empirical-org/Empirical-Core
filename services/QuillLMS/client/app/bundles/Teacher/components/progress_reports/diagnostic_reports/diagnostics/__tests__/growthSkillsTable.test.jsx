import { mount } from 'enzyme'
import React from 'react'

import GrowthSkillsTable from '../growthSkillsTable'

const skillGroup = {"skill_group":"Adjectives and Adverbs","description":"Students who show proficiency in this skill will correctly place single adjectives, adverbs, cumulative adjectives, coordinate adjectives, and adjectives and adverbs together. Students will also make the correct choice between a comparative and superlative adjective and correctly order cumulative adjectives. Students will correctly punctuate by placing a comma between two coordinate adjectives.","skills":[{"pre":{"id":125,"skill":"Adjectives and Adverbs","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},"post":{"id":125,"skill":"Adjectives and Adverbs","number_correct":1,"number_incorrect":0,"summary":"Fully correct"}},{"pre":{"id":120,"skill":"Adverbs of Manner","number_correct":0,"number_incorrect":1,"summary":"Not correct"},"post":{"id":120,"skill":"Adverbs of Manner","number_correct":0,"number_incorrect":1,"summary":"Not correct"}},{"pre":{"id":122,"skill":"Comparative Adjectives","number_correct":2,"number_incorrect":0,"summary":"Fully correct"},"post":{"id":122,"skill":"Comparative Adjectives","number_correct":2,"number_incorrect":0,"summary":"Fully correct"}},{"pre":{"id":123,"skill":"Coordinate Adjectives","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},"post":{"id":123,"skill":"Coordinate Adjectives","number_correct":1,"number_incorrect":0,"summary":"Fully correct"}},{"pre":{"id":124,"skill":"Cumulative Adjectives","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},"post":{"id":124,"skill":"Cumulative Adjectives","number_correct":0,"number_incorrect":1,"summary":"Not correct"}},{"pre":{"id":121,"skill":"Single Adjectives","number_correct":1,"number_incorrect":0,"summary":"Fully correct"},"post":{"id":121,"skill":"Single Adjectives","number_correct":1,"number_incorrect":0,"summary":"Fully correct"}}],"number_of_correct_skills_text":"4 of 6 skills correct","proficiency_text":"Partial proficiency","pre_test_proficiency":"Partial proficiency","post_test_proficiency":"Partial proficiency","id":65,"acquired_skill_ids":[]}

describe('GrowthSkillsTable component', () => {
  it('should render when it is not expandable', () => {
    const wrapper = mount(<GrowthSkillsTable
      isExpandable={false}
      skillGroup={skillGroup}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when it is expandable', () => {
    const wrapper = mount(<GrowthSkillsTable
      isExpandable={true}
      skillGroup={skillGroup}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
