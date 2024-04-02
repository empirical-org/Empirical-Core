import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useModalAccessibility from '../useModalAccessibility';

// Mock Modal Component using the useModalAccessibility hook
const MockModal = ({ onClose }) => {
  const { modalRef } = useModalAccessibility(onClose);
  return (
    <div ref={modalRef} tabIndex={-1}>
      <input aria-label="Input Field" />
      <button type="button">Button</button>
    </div>
  );
};

describe('useModalAccessibility', () => {
  test('traps focus within the modal', async () => {
    const handleClose = jest.fn();
    render(<MockModal onClose={handleClose} />);

    const input = screen.getByLabelText('Input Field');
    const button = screen.getByRole('button', { name: 'Button' });

    await userEvent.tab(); // Focuses first focusable element
    expect(input).toHaveFocus();

    await userEvent.tab(); // Focuses next element
    expect(button).toHaveFocus();

    // Simulate wrapping around to the first element
    await userEvent.tab();
    expect(input).toHaveFocus(); // As it's the last focusable element
  });

  test('closes the modal on ESC key press', async () => {
    const handleClose = jest.fn();
    render(<MockModal onClose={handleClose} />);

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  test('does not close the modal when clicking inside', async () => {
    const handleClose = jest.fn();
    render(<MockModal onClose={handleClose} />);

    const button = screen.getByRole('button', { name: 'Button' });
    await userEvent.click(button);
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('closes the modal when clicking outside of it', async () => {
    const handleClose = jest.fn();
    const { baseElement } = render(<MockModal onClose={handleClose} />);

    await userEvent.click(baseElement);
    expect(handleClose).toHaveBeenCalled();
  });
});
