import * as React from 'react'
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { activityOne, optimalSubmittedResponse, suboptimalSubmittedResponse, } from './data'

import { stripEvidenceHtml } from '../../../libs/stringFormatting'
import PromptStep from '../../../components/studentView/promptStep'
import EditorContainer from '../../../components/studentView/editorContainer'

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

const prompt = activityOne.prompts[2]

const defaultProps = {
  activityIsComplete: false,
  className: 'step',
  everyOtherStepCompleted: false,
  submitResponse: () => {},
  completeStep: () => {},
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

      describe('#stripEvidenceHtml', () => {
        it('should return a string stripped of all u and p tags', () => {
          const htmlString = '<p>I am a paragraph<u> with an underline</u></p>'
          expect(stripEvidenceHtml(htmlString)).toEqual('I am a paragraph with an underline')
        })
      })

      describe('#formattedPrompt', () => {
        it('should return the prompt inside a p tag with the last word underlined and a &nbsp at the end', () => {
          expect(wrapper.instance().formattedPrompt()).toEqual("<p>Governments should make voting compulsory <u>because</u>&nbsp;</p>")
        })

      })

      // TODO: determine fix for IndexSizeError: Invalid range index.

      // describe('#onTextChange', () => {
      //   describe('when the submission includes the prompt stem', () => {
      //     it('should update the state to match the new submission', () => {
      //       const submission = { target: { value: "<p>Governments should make voting compulsory <u>because</u>&nbsp;otherwise not everyone will vote.</p>" }}
      //       wrapper.instance().onTextChange(submission)
      //       expect(wrapper.state('html')).toBe(submission.target.value)
      //     })
      //   })

      //   describe('when the submission is <br> (e.g. the user deleted all the text)', () => {
      //     it('should update the state to be just the prompt stem', () => {
      //       const submission = { target: { value: "<br>" }}
      //       wrapper.instance().onTextChange(submission)
      //       expect(wrapper.state('html')).toBe(wrapper.instance().formattedPrompt())
      //     })
      //   })

      //   describe('when the submission is not <br> or an empty string and does not include the prompt stem', () => {
      //     it('should update the state to reconcile the change', () => {
      //       const submission = { target: { value: "<p>Governments should make voting c</p>" }}
      //       wrapper.instance().onTextChange(submission)
      //       expect(wrapper.state('html')).toBe("Governments should make voting compulsory <u>because</u>&nbsp;c")
      //     })
      //   })
      // })

      describe('#handleGetFeedbackClick', () => {
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

    describe('when an optimal response has been submitted', () => {
      const submittedResponses = [optimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      wrapper.setState({ html: optimalSubmittedResponse.entry })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a non-disabled button with the text "Next"', () => {
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(0)
        expect(wrapper.find('.quill-button').text()).toEqual("Next")
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

      wrapper.setState({ html: suboptimalSubmittedResponse.entry })

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

      it('has a disabled button with the text "Get feedback"', () => {
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(1)
        expect(wrapper.find('.quill-button.disabled').text()).toEqual("Get feedback")
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

      it('has a non-disabled button with the text "Next"', () => {
        expect(wrapper.find('.quill-button.disabled')).toHaveLength(0)
        expect(wrapper.find('.quill-button').text()).toEqual("Next")
      })
    })

    describe('when the max attempts have been reached or the last answer is optimal and every other question has been completed', () => {
      const submittedResponses = [optimalSubmittedResponse]
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        activityIsComplete
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

    describe('while submitting a response', () => {
      const submittedResponses = []
      const wrapper = mount(<PromptStep
        {...defaultProps}
        active
        className="step active"
        submittedResponses={submittedResponses}
      />)

      wrapper.setState({ submissionTime: 1000, currentTime: 3000 })


      it('displays "Finding feedback..." when feedback loading state is under 5 seconds', () => {
        expect(wrapper.find('.feedback-details-section')).toHaveLength(1)
        expect(wrapper.find('.feedback-details-section').props().children[0].props.children).toEqual('Finding feedback...')
      })
      it('displays "Finding feedback..." when feedback loading state is over 5 seconds', () => {
        wrapper.setState({ submissionTime: 1000, timeAtLastFeedbackSubmissionCheck: 17000 })
        expect(wrapper.find('.feedback-details-section')).toHaveLength(1)
        expect(wrapper.find('.feedback-details-section').props().children[0].props.children).toEqual('Still finding feedback. Thanks for your patience!')
      })
    })
  })

})
