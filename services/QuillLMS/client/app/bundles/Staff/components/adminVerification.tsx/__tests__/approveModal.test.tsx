import * as React from 'react';
import { mount } from 'enzyme';

import ApproveModal from '../approveModal';

describe('ApproveModal component', () => {
  const mockProps = {
    closeModal: jest.fn(),
    approve: jest.fn()
  }

  const container = mount(<ApproveModal {...mockProps} />);

  it('should render ApproveModal', () => {
    expect(container).toMatchSnapshot();
  });
});
