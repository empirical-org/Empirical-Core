import React from 'react';
import { shallow } from 'enzyme';

import BasicTeacherInfo from '../basic_teacher_info';

describe('BasicTeacherInfo component', () => {

  it('renders a signup form', () => {
    const wrapper = shallow(
        <BasicTeacherInfo signUp={() => null} update={() => null} errors={{}}/>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('applies textInputGenerator generate function to form fields', () => {

    const formFields = [
        {
            name: 'first_name',
            label: 'First Name',
            errorKey: 'name',
            errorLabel: 'Name'
        }, {
            name: 'last_name',
            label: 'Last Name',
            errorKey: 'name',
            errorLabel: 'Name'
        }, {
            name: 'email'
        }, {
            name: 'password'
        }
    ];

    const mockGenerator = jest.fn();
    const wrapper = shallow(
        <BasicTeacherInfo signUp={() => null} update={() => null}  errors={{}} />
    );
  });

});
