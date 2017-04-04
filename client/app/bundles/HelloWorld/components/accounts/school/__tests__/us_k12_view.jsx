import React from 'react';
import { shallow, mount } from 'enzyme';

import UsK12View from '../us_k12_view'

describe('US K12 component', () => {
  describe('select school button', ()=>{
    it('should render if there is a selected school', () => {
      const wrapper = shallow(
        <UsK12View
          teacherFromGoogleSignUp={Boolean(true)}
          analytics = {{ track: function(){} }} />
      )
      wrapper.setState({selectedSchool: {name: 'df'}})
      expect(wrapper.find('.select_school_button').length).toBe(1);
    })

    it('not render if there is not a selected school', () => {
      const wrapper = shallow(
        <UsK12View
          teacherFromGoogleSignUp={Boolean(true)}
          analytics = {{ track: function(){} }} />
      )
      expect(wrapper.find('.select_school_button').length).toBe(0);
    })

  })



});
