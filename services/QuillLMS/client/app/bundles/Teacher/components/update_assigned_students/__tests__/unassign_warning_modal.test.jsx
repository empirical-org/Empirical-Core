import {
  mount,
} from 'enzyme';
import _ from 'lodash';
import React from 'react';

import UnassignWarningModal from '../unassign_warning_modal';

const props = {
  removedStudentCount: 2,
  toggleCheckbox: jest.fn(),
  closeModal: jest.fn(),
  handleClickUpdate: jest.fn(),
  hideWarningModalInFuture: jest.fn()
}

describe('UnassignWarningModal', () => {
  it('should render ', () => {
    const component = mount(<UnassignWarningModal {...props} />)

    expect(component).toMatchSnapshot()
  })
})
