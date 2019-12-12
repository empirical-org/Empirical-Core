import * as React from 'react'
import { shallow } from 'enzyme';

import PromptStep from '../../components/studentView/promptStep'
import EditorContainer from '../../components/studentView/editorContainer'

import { activityOne } from './data'

const defaultProps = {
  active: false,
  className: 'step',
  everyOtherStepCompleted: false,
  submitResponse: () => {},
  completeStep: () => {},
  stepNumberComponent: <span />,
  onClick: () => {},
  prompt: activityOne.prompts[0],
  passedRef: () => {},
  submittedResponses: []
}

describe('PromptStep component', () => {
  describe('inactive state', () => {
    const wrapper = shallow(<PromptStep
      { ...defaultProps}
    />)

    it('renders', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('active state', () => {
    describe('before any responses have been submitted', () => {
      const wrapper = shallow(<PromptStep
        { ...defaultProps}
        active={true}
        className="step active"
      />)

      it('matches snapshot', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('renders an EditorContainer', () => {
        expect(wrapper.find(EditorContainer)).toHaveLength(1)
      })

    })
  })

})
