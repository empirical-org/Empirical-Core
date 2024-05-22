import { mount } from 'enzyme';
import * as React from 'react';

import DenyModal from '../denyModal';

describe('DenyModal component', () => {
  const mockProps = {
    closeModal: jest.fn(),
    deny: jest.fn()
  }

  const container = mount(<DenyModal {...mockProps} />);

  it('should render DenyModal', () => {
    expect(container).toMatchSnapshot();
  });
});
