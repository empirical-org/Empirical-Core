import React from 'react'
import { mount } from 'enzyme'
import { QuestionRow } from 'quill-component-library/dist/componentLibrary'

const question = {
  key: 'question',
  prompt: "You don't like to ski. Try ice skating.",
  percentWeak: '0.82',
  commonUnmatched: '14',
  unmatched: '94',
  attempts: '21457',
  responses: '1505',
  hasModelConcept: 'false',
  focusPoints: '11',
  incorrectSequences: '0'
}

describe('QuestionRow component', () => {
  const wrapper = mount(<QuestionRow question={question} />)

  it('renders a tr', () => {
    expect(wrapper.find('tr')).toHaveLength(1)
  })

  it('renders 9 td', () => {
    expect(wrapper.find('td')).toHaveLength(9)
  })

  it('renders its first td with the text of the prompt', () => {
    expect(wrapper.find('td').first().text()).toEqual(question.prompt)
  })

  it('renders its second td with the percentWeak', () => {
    expect(wrapper.find('td').at(1).text()).toEqual(question.percentWeak)
  })
  it('renders its third td with the number of commonUnmatched', () => {
    expect(wrapper.find('td').at(2).text()).toEqual(question.commonUnmatched)
  })
  it('renders its fourth td with the number of unmatched', () => {
    expect(wrapper.find('td').at(3).text()).toEqual(question.unmatched)
  })
  it('renders its fifth td with the number of responses', () => {
    expect(wrapper.find('td').at(4).text()).toEqual(question.responses)
  })
  it('renders its sixth td with the number of attempts', () => {
    expect(wrapper.find('td').at(5).text()).toEqual(question.attempts)
  })
  it('renders its seventh td with the stringified text of hasModelConcept', () => {
    expect(wrapper.find('td').at(6).text()).toEqual(question.hasModelConcept)
  })
  it('renders its eighth td with the number of focusPoints', () => {
    expect(wrapper.find('td').at(7).text()).toEqual(question.focusPoints)
  })
  it('renders its ninth td with the number of incorrectSequences', () => {
    expect(wrapper.find('td').at(8).text()).toEqual(question.incorrectSequences)
  })

})
