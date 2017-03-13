import React from 'react';
import { shallow } from 'enzyme';

import NewStudent from '../new_student';

describe('NewStudent component', () => {

  it('renders a signup form', () => {
    const wrapper = shallow(
        <NewStudent signUp={() => null} textInputGenerator={{generate: () => null}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('applies textInputGenerator generate function to form fields', () => {

    const formFields = [
      {
        name: 'first_name',
        label: 'First Name',
        errorLabel: 'Name'
      },
      {
        name: 'last_name',
        label: 'Last Name',
        errorLabel: 'Name'
      },
      {
        name: 'username'
      },
      {
        name: 'email',
        label: 'Email (optional)',
        errorLabel: 'Email'
      },
      {
        name: 'password'
      }
    ];

    const mockGenerator = jest.fn();
    const wrapper = shallow(
        <NewStudent signUp={() => null} textInputGenerator={{generate: mockGenerator}} />
    );
    expect(mockGenerator.mock.calls[0][0]).toEqual(formFields);
  });

});
