import React from 'react'
import { mount } from 'enzyme'
import { QuestionRow } from 'quill-component-library/dist/componentLibrary'

const question = {
  key: 'question',
  prompt: "You don't like to ski. Try ice skating.",
  weakResponses: '40',
  commonUnmatched: '14',
  unmatched: '94',
  attempts: '21457',
  responses: '1505',
  hasModelConcept: 'false',
  focusPoints: '11',
  incorrectSequences: '0',
  activities: [],
  status: 'Good',
  flag: 'production'
}

describe('QuestionRow component', () => {
  const wrapper = mount(<QuestionRow question={question} />)

  it('renders a tr', () => {
    expect(wrapper.find('tr')).toHaveLength(1)
  })

  it('renders 9 td', () => {
    expect(wrapper.find('td')).toHaveLength(10)
  })

  it('renders its second td with the text of the prompt', () => {
    expect(wrapper.find('td').at(1).text()).toEqual(question.prompt)
  })
  it('renders its third td with the number of responses', () => {
    expect(wrapper.find('td').at(2).text()).toEqual(question.responses)
  })

  it('renders its fourth td with the percentage of weak responses', () => {
    expect(wrapper.find('td').at(3).text()).toEqual(`${question.weakResponses}%`)
  })
  it('renders its fifth td with the status', () => {
    expect(wrapper.find('td').at(4).text()).toEqual(question.status)
  })
  it('renders its sixth td with the number of focusPoints', () => {
    expect(wrapper.find('td').at(5).text()).toEqual(question.focusPoints)
  })
  it('renders its seventh td with the number of incorrectSequences', () => {
    expect(wrapper.find('td').at(6).text()).toEqual(question.incorrectSequences)
  })

  it('renders its eighth td with the stringified text of hasModelConcept', () => {
    expect(wrapper.find('td').at(7).text()).toEqual(question.hasModelConcept)
  })

  it('renders its ninth td with the flag', () => {
    expect(wrapper.find('td').at(8).text()).toEqual(question.flag)
  })
  it('renders its tenth td with an empty string if there are no activities', () => {
    expect(wrapper.find('td').at(9).text()).toEqual('')
  })
})
