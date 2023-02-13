import * as React from 'react';
import { mount } from 'enzyme';

import UndoModal from '../undoModal';

describe('UndoModal component', () => {
  const mockProps = {
    closeModal: jest.fn(),
    undo: jest.fn()
  }

  const container = mount(<UndoModal {...mockProps} />);

  it('should render UndoModal', () => {
    expect(container).toMatchSnapshot();
  });
});
