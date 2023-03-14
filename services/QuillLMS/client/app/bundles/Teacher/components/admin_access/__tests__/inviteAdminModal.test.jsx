import React from 'react';
import { mount } from 'enzyme';

import InviteAdminModal from '../inviteAdminModal'

describe('InviteAdminModal container', () => {
  it('should render', () => {
    expect(mount(<InviteAdminModal closeModal={jest.fn()} />)).toMatchSnapshot();
  })
})
