import * as React from 'react'
import { shallow, mount, } from 'enzyme'
import toJson from 'enzyme-to-json'

import EditorContainer from '../../components/studentView/editorContainer'

describe('EditorContainer component', () => {
  describe('when the activity has loaded', () => {
    const wrapper = mount(<EditorContainer
      className='step'
      disabled={false}
      handleTextChange={() => {}}
      html="Here is some text <u>because</u>&nbsp;"
      innerRef={() => {}}
      resetText={() => {}}
      stripHtml={(str) => 'string'}
      unsubmittableResponses={[]}
    />)

    it('renders', () => {
      expect(toJson(wrapper)).toMatchSnapshot()
    })

  })
})
