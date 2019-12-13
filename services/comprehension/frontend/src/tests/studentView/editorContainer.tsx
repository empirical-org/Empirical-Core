import * as React from 'react'
import { shallow, mount, } from 'enzyme'
import toJson from 'enzyme-to-json'

import EditorContainer from '../../components/studentView/editorContainer'

describe('EditorContainer component', () => {
  describe('when the activity has loaded', () => {
    const wrapper = mount(<EditorContainer
      unsubmittableResponses={[]}
      stripHtml={(str) => 'string'}
      html="Here is some text <u>because</u>&nbsp;"
      disabled={false}
      resetText={() => {}}
      innerRef={() => {}}
      handleTextChange={() => {}}
      className='step'
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

  })
})
