import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import ActivityRow from '../activity_row'

describe('ActivityRow component', () => {
  const sharedProps = {
    activity: activities[0],
    isSelected: false,
    isFirst: false,
    toggleActivitySelection: () => {},
    showCheckbox: true,
    showRemoveButton: false,
    setShowSnackbar: () => {},
    gradeLevelFilters: []
  }

  describe('with showCheckbox true and showRemoveButton false', () => {
    describe('is selected', () => {
      it('should render', () => {
        const wrapper = mount(<ActivityRow {...sharedProps} isSelected={true} />)
        expect(wrapper).toMatchSnapshot();
      });
    })
    describe('is not selected', () => {
      it('should render', () => {
        const wrapper = mount(<ActivityRow {...sharedProps} />)
        expect(wrapper).toMatchSnapshot();
      });
    })
  })

  describe('with showCheckbox false and showRemoveButton true', () => {
    describe('is selected', () => {
      it('should render', () => {
        const wrapper = mount(<ActivityRow {...sharedProps} isSelected={true} showCheckbox={false} showRemoveButton={true} />)
        expect(wrapper).toMatchSnapshot();
      });
    })
    describe('is not selected', () => {
      it('should render', () => {
        const wrapper = mount(<ActivityRow {...sharedProps} showCheckbox={false} showRemoveButton={true} />)
        expect(wrapper).toMatchSnapshot();
      });
    })
  })

})
