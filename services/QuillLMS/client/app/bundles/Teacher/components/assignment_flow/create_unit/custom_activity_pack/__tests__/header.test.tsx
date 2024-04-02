import { mount } from 'enzyme';
import * as React from 'react';

import { activities } from './data';

import Header from '../header';

describe('Header component', () => {
  const props = {
    handleClickContinue: (event: any) => {},
    selectedActivities: [],
    setSelectedActivities: (selectedActivities) => {},
    toggleActivitySelection: (activity, isSelected: boolean) => {}
  }

  describe('with no selected activities', () => {
    it('should render', () => {
      const wrapper = mount(<Header {...props} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

  describe('with some selected activities', () => {
    it('should render', () => {
      const wrapper = mount(<Header {...props} selectedActivities={activities.splice(5, 10)} />)
      expect(wrapper).toMatchSnapshot();
    });
  })

})
