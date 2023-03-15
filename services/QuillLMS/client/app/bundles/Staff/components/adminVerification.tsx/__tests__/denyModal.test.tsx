import * as React from 'react';
import { mount } from 'enzyme';

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
