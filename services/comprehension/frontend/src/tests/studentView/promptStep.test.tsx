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
      {...defaultProps}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('active state', () => {
    describe('instance methods', () => {
      const submittedResponses = [suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse, suboptimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      describe('#resetText', () => {
        it('should reset the html to the formatted prompt', () => {
          wrapper.setState({ html: 'something that is not the original html'})
          wrapper.instance().resetText()
          expect(wrapper.state('html')).toEqual(wrapper.instance().formattedPrompt())
        })
      })

      describe('#lastSubmittedResponse', () => {
        it('should return the last submitted response', () => {
          const lastSubmittedResponse = wrapper.instance().lastSubmittedResponse()
          expect(lastSubmittedResponse).toEqual(submittedResponses[3])
        })
      })

      describe('#unsubmittableResponses', () => {
        it('should return the formatted prompt and all of the submitted responses', () => {
          const entries = submittedResponses.map(r => r.entry)
          const arrayOfUnsubmittableResponses = entries.concat([defaultProps.prompt.text])
          const unsubmittableResponses = wrapper.instance().unsubmittableResponses()
          expect(unsubmittableResponses).toEqual(arrayOfUnsubmittableResponses)
        })
      })

      describe('#stripHtml', () => {
        it('should return a string stripped of all u and p tags', () => {
          const htmlString = '<p>I am a paragraph<u> with an underline</u></p>'
          expect(wrapper.instance().stripHtml(htmlString)).toEqual('I am a paragraph with an underline')
        })
      })

      describe('#formattedPrompt', () => {
        it('should return the prompt inside a p tag with the last word underlined and a &nbsp at the end', () => {
          expect(wrapper.instance().formattedPrompt()).toEqual("<p>Governments should make voting compulsory <u>because</u>&nbsp;</p>")
        })

      })

      describe('#allButLastWord', () => {
        it('should return all but the last word of a string', () => {
          expect(wrapper.instance().allButLastWord('This is a string')).toEqual('This is a')
        })
      })

      describe('#lastWord', () => {
        it('should return the last word of a string', () => {
          expect(wrapper.instance().lastWord('This is a string')).toEqual('string')
        })
      })

      describe('#handleTextChange', () => {
        describe('when the submission includes the prompt stem', () => {
          it('should update the state to match the new submission', () => {
            const submission = { target: { value: "<p>Governments should make voting compulsory <u>because</u>&nbsp;otherwise not everyone will vote.</p>" }}
            wrapper.instance().handleTextChange(submission)
            expect(wrapper.state('html')).toBe(submission.target.value)
          })
        })

        describe('when the submission is <br> (e.g. the user deleted all the text)', () => {
          it('should update the state to be just the prompt stem', () => {
            const submission = { target: { value: "<br>" }}
            wrapper.instance().handleTextChange(submission)
            expect(wrapper.state('html')).toBe(wrapper.instance().formattedPrompt())
          })
        })

        describe('when the submission is not <br> or an empty string and does not include the prompt stem', () => {
          it('should not update the state', () => {
            const existingHtmlValue = wrapper.state('html')
            const submission = { target: { value: "<p>Governments should make voting c</p>" }}
            wrapper.instance().handleTextChange(submission)
            expect(wrapper.state('html')).toBe(existingHtmlValue)
          })
        })
      })
    })

    describe('before any responses have been submitted', () => {
      const wrapper = mount(<PromptStep
        {...defaultProps}
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
        {...defaultProps}
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
        {...defaultProps}
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
        {...defaultProps}
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
        {...defaultProps}
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
        {...defaultProps}
        active
        className="step active"
        everyOtherStepCompleted
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
