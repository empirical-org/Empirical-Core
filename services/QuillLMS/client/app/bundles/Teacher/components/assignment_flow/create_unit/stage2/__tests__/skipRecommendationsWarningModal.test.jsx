import { mount } from 'enzyme'
import React from 'react'

import SkipRecommendationsWarningModal from '../skipRecommendationsWarningModal'

describe('SkipRecommendationsWarningModal component', () => {

  it('should render', () => {
    const wrapper = mount(
      <SkipRecommendationsWarningModal
        handleClickAssign={() => {}}
        handleCloseModal={() => {}}
        restrictedActivityId={1669}
        studentNames={['Student Name']}
      />)
    expect(wrapper).toMatchSnapshot()
  })
})
