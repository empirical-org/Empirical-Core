import React from 'react';
import { shallow } from 'enzyme';

import ActiveClassrooms from '../active_classrooms.tsx';

describe('ActiveClassrooms component', () => {

  describe('with no classrooms', () => {

    const wrapper = shallow(
      <ActiveClassrooms classrooms={[]} />
    );

    it('should render with no classrooms', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have a no active classes div', () => {
      expect(wrapper.find('.no-active-classes').exists()).toBe(true);
    })
  })

});
