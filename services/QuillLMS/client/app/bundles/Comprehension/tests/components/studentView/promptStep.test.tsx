import * as React from 'react'
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { activityOne, optimalSubmittedResponse, suboptimalSubmittedResponse, } from './data'

import PromptStep from '../../../components/studentView/promptStep'
import EditorContainer from '../../../components/studentView/editorContainer'
import { TOO_LONG_FEEDBACK, TOO_SHORT_FEEDBACK, MULTIPLE_SENTENCES_FEEDBACK, PROFANITY_FEEDBACK } from '../../../modules/prefilters'



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
          const lastSubmittedResponseIndex = submittedResponses.length - 1
          expect(lastSubmittedResponse).toEqual(submittedResponses[lastSubmittedResponseIndex])
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

      describe('#onTextChange', () => {
        describe('when the submission includes the prompt stem', () => {
          it('should update the state to match the new submission', () => {
            const submission = { target: { value: "<p>Governments should make voting compulsory <u>because</u>&nbsp;otherwise not everyone will vote.</p>" }}
            wrapper.instance().onTextChange(submission)
            expect(wrapper.state('html')).toBe(submission.target.value)
          })
        })

        describe('when the submission is <br> (e.g. the user deleted all the text)', () => {
          it('should update the state to be just the prompt stem', () => {
            const submission = { target: { value: "<br>" }}
            wrapper.instance().onTextChange(submission)
            expect(wrapper.state('html')).toBe(wrapper.instance().formattedPrompt())
          })
        })

        describe('when the submission is not <br> or an empty string and does not include the prompt stem', () => {
          it('should update the state to reconcile the change', () => {
            const submission = { target: { value: "<p>Governments should make voting c</p>" }}
            wrapper.instance().onTextChange(submission)
            expect(wrapper.state('html')).toBe("Governments should make voting compulsory <u>because</u>&nbsp;c")
          })
        })
      })

      describe('#handleGetFeedbackClick', () => {
        describe('when a profane response is submitted', () => {
          it('should set the state to have the profanity feedback', () => {
            const entry = "Governments should make voting compulsory because of some shit"
            wrapper.setState({ customFeedback: null, customFeedbackKey: null, })
            wrapper.instance().handleGetFeedbackClick(entry, prompt.prompt_id, prompt.text)
            expect(wrapper.state('customFeedback')).toBe(PROFANITY_FEEDBACK)
            expect(wrapper.state('customFeedbackKey')).toBe('profanity')
          })
        })

        describe('when a prompt with multiple sentences is submitted', () => {
          it('should set the state to have the multiple sentences feedback', () => {
            const entry = "Governments should make voting compulsory because I want them to. I think politicans I like will get elected if everyone votes."
            wrapper.setState({ customFeedback: null, customFeedbackKey: null, })
            wrapper.instance().handleGetFeedbackClick(entry, prompt.prompt_id, prompt.text)
            expect(wrapper.state('customFeedback')).toBe(MULTIPLE_SENTENCES_FEEDBACK)
            expect(wrapper.state('customFeedbackKey')).toBe('multiple-sentences')
          })
        })

        describe('when a prompt with only one sentence, but containing a known abbreviation is submitted', () => {
          it('should not set custom feedback or a custom feedback key', () => {
            const entry = "Governments should make voting compulsory because the U.S.A. is a democracy."
            wrapper.setState({ customFeedback: null, customFeedbackKey: null, })
            wrapper.instance().handleGetFeedbackClick(entry, prompt.prompt_id, prompt.text)
            expect(wrapper.state('customFeedback')).toBe(null)
            expect(wrapper.state('customFeedbackKey')).toBe(null)
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
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(1)
        expect(wrapper.find('.quill-button.disabled').text()).toEqual("Get feedback")
      })

    })

    describe('when a too-short response has been submitted', () => {
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
      />)

      wrapper.setState({ customFeedback: TOO_SHORT_FEEDBACK, customFeedbackKey: 'too-short' })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has feedback with the too-short response text text"', () => {
        expect(wrapper.find('.feedback-text').text()).toEqual(TOO_SHORT_FEEDBACK)
      })

    })

    describe('when a profane response has been submitted', () => {
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
      />)

      wrapper.setState({ customFeedback: PROFANITY_FEEDBACK, customFeedbackKey: 'profanity' })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has feedback with the too-short response text text"', () => {
        expect(wrapper.find('.feedback-text').text()).toEqual(PROFANITY_FEEDBACK)
      })

    })

    describe('when a response with multiple sentences has been submitted', () => {
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
      />)

      wrapper.setState({ customFeedback: MULTIPLE_SENTENCES_FEEDBACK, customFeedbackKey: 'multiple-sentences' })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has feedback with the too-short response text text"', () => {
        expect(wrapper.find('.feedback-text').text()).toEqual(MULTIPLE_SENTENCES_FEEDBACK)
      })

    })

    describe('when a too-long response has been submitted', () => {
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
      />)

      wrapper.setState({ customFeedback: TOO_LONG_FEEDBACK, customFeedbackKey: 'too-long' })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has feedback with the too-long response text text"', () => {
        expect(wrapper.find('.feedback-text').text()).toEqual(TOO_LONG_FEEDBACK)
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
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(0)
        expect(wrapper.find('.quill-button').text()).toEqual("Start next sentence")
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
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(1)
        expect(wrapper.find('.quill-button.disabled').text()).toEqual("Get new feedback")
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
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(0)
        expect(wrapper.find('.quill-button').text()).toEqual("Start next sentence")
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
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(0)
        expect(wrapper.find('.quill-button').text()).toEqual("Done")
      })
    })
  })

})
