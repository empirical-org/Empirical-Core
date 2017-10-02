import React from 'react';
import { shallow, mount } from 'enzyme';

import UsK12View from './us_k12_view'

describe('US K12 component', () => {

  it('should only render the select school button if there is a selected school', () => {
    const wrapper = shallow(
      <UsK12View
        teacherFromGoogleSignUp={Boolean(true)}
        analytics = {{ track: function(){} }} />
    )
    wrapper.setState({selectedSchool: {name: 'df'}})
    expect(wrapper.find('.select_school_button').length).toBe(1);

    // expect(window.location.pathname).toBe('/teachers/classrooms/google_sync')
  })

});
