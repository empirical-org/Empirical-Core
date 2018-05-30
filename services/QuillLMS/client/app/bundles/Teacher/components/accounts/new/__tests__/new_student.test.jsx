import React from 'react';
import { shallow } from 'enzyme';

import NewStudent from '../new_student';

describe('NewStudent component', () => {

  it('renders a signup form', () => {
    const wrapper = shallow(
        <NewStudent signUp={() => null} errors={{}}/>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders an input field for each formField', () => {
    const wrapper = shallow(
        <NewStudent signUp={() => null} errors={{}}/>
    );
    expect(wrapper.find('input')).toHaveLength(wrapper.instance().formFields.length);
  })

})
