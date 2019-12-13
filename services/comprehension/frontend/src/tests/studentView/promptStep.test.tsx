import * as React from 'react'
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import PromptStep from '../../components/studentView/promptStep'
import EditorContainer from '../../components/studentView/editorContainer'

import { activityOne, optimalSubmittedResponse, suboptimalSubmittedResponse, } from './data'

const prompt = activityOne.prompts[0]

const defaultProps = {
  active: false,
  className: 'step',
  everyOtherStepCompleted: false,
  submitResponse: () => {},
  completeStep: () => {},
  stepNumberComponent: <span />,
  onClick: () => {},
  prompt,
  passedRef: () => {},
  submittedResponses: []
}

describe('PromptStep component', () => {
  describe('inactive state', () => {
    const wrapper = mount(<PromptStep
      { ...defaultProps}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('active state', () => {
    describe('before any responses have been submitted', () => {
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        className="step active"
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a button with a disabled class and the text "Get feedback"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(1)
        expect(wrapper.find('button.disabled').text()).toEqual("Get feedback")
      })

    })

    describe('before any responses have been submitted', () => {
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        className="step active"
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a button with a disabled class and the text "Get feedback"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(1)
        expect(wrapper.find('button.disabled').text()).toEqual("Get feedback")
      })

    })

    describe('when an optimal response has been submitted', () => {
      const submittedResponses = [optimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a non-disabled button with the text "Start next sentence"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(0)
        expect(wrapper.find('button').text()).toEqual("Start next sentence")
      })

    })

    describe('when a suboptimal response has been submitted', () => {
      const submittedResponses = [suboptimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a disabled button with the text "Get new feedback"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(1)
        expect(wrapper.find('button.disabled').text()).toEqual("Get new feedback")
      })
    })

    describe('when the max attempts have been reached', () => {
      const submittedResponses = [suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a non-disabled button with the text "Start next sentence"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(0)
        expect(wrapper.find('button').text()).toEqual("Start next sentence")
      })
    })

    describe('when the max attempts have been reached or the last answer is optimal and every other question has been completed', () => {
      const submittedResponses = [optimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        { ...defaultProps}
        active
        everyOtherStepCompleted
        className="step active"
        submittedResponses={submittedResponses}
      />)

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a non-disabled button with the text "Done"', () => {
        expect(wrapper.find('button.disabled')).toHaveLength(0)
        expect(wrapper.find('button').text()).toEqual("Done")
      })
    })

  })

})
