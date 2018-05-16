import React from 'react'
import { shallow } from 'enzyme'
import GoogleClassroomModal from '../google_classroom_modal.jsx'

const user={email: 'hal@spaceodyssey.org'}

import processEnvMock from '../../../../../../__mocks__/processEnvMock.js';
window.process = processEnvMock;

describe('the GoogleClassroomModal component', () => {

  it('should render', () => {
      const wrapper = shallow(
        <GoogleClassroomModal user={user} />
      )
      expect(wrapper).toMatchSnapshot()
  })

})
