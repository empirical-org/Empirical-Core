import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import * as React from 'react'

import EditorContainer from '../../../components/studentView/editorContainer'

describe('EditorContainer component', () => {
  describe('when the activity has loaded', () => {
    const handleTextChange = () => {}
    const innerRef = () => {}
    const resetText = () => {}
    const stripHtml = (str) => { 'string' }
    const wrapper = mount(<EditorContainer
      className='step'
      disabled={false}
      handleTextChange={handleTextChange}
      html="Here is some text <u>because</u>&nbsp;"
      innerRef={innerRef}
      resetText={resetText}
      stripHtml={stripHtml}
      unsubmittableResponses={[]}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

  })
})
