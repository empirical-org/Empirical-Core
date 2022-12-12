import React from 'react'
import { mount } from 'enzyme'

import {
  IMMEDIATE,
  STAGGERED,
} from '../shared'
import ReleaseMethodModal from '../releaseMethodModal'

const sharedProps = {
  visible: true,
  handleClickAssign: () => {},
  handleClickCancel: () => {},
  setReleaseMethod: () => {}
}

const originalReleaseMethodStaggeredProps = {
  ...sharedProps,
  originalReleaseMethod: STAGGERED,
  releaseMethod: STAGGERED
}

const originalReleaseMethodImmediateProps = {
  ...sharedProps,
  originalReleaseMethod: IMMEDIATE,
  releaseMethod: IMMEDIATE
}

describe('ReleaseMethodModal component', () => {

  describe('with no original release method', () => {

    it('should render on initial load', () => {
      const wrapper = mount(<ReleaseMethodModal {...sharedProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render when STAGGERED is selected', () => {
      const wrapper = mount(<ReleaseMethodModal {...sharedProps} releaseMethod={STAGGERED} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render when IMMEDIATE is selected', () => {
      const wrapper = mount(<ReleaseMethodModal {...sharedProps} releaseMethod={IMMEDIATE} />)
      expect(wrapper).toMatchSnapshot()
    })

  })

  describe('with IMMEDIATE as the original release method', () => {

    it('should render on initial load', () => {
      const wrapper = mount(<ReleaseMethodModal {...originalReleaseMethodImmediateProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render when STAGGERED is selected', () => {
      const wrapper = mount(<ReleaseMethodModal {...originalReleaseMethodImmediateProps} releaseMethod={STAGGERED} />)
      expect(wrapper).toMatchSnapshot()
    })

  })

  describe('with STAGGERED as the original release method', () => {

    it('should render on initial load', () => {
      const wrapper = mount(<ReleaseMethodModal {...originalReleaseMethodStaggeredProps} />)
      expect(wrapper).toMatchSnapshot()
    })

    it('should render when IMMEDIATE is selected', () => {
      const wrapper = mount(<ReleaseMethodModal {...originalReleaseMethodStaggeredProps} releaseMethod={IMMEDIATE} />)
      expect(wrapper).toMatchSnapshot()
    })

  })


})
