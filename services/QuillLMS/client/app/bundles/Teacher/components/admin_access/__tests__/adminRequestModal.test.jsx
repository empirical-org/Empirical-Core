import React from 'react';
import { mount } from 'enzyme';

import AdminRequestModal from '../adminRequestModal'

const schoolAdmins = [
  {
    id: 1,
    name: 'Toni Morrison',
    email: 'toni.morrison@quill.org'
  },
  {
    id: 2,
    name: 'James Baldwin',
    email: 'james.baldwin@quill.org'
  }
]

describe('AdminRequestModal container', () => {
  it('should render', () => {
    expect(mount(<AdminRequestModal closeModal={jest.fn()} onSuccess={jest.fn()} schoolAdmins={schoolAdmins} />)).toMatchSnapshot();
  })
})
