import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EnableMoreThanLabelsModal from '../enableMoreThanTenLabelsModal';

describe('EnableMoreThanLabelsModal', () => {
  const mockSave = jest.fn();
  const mockCancel = jest.fn();

  const setup = (isOpen = true) => render(
    <EnableMoreThanLabelsModal cancel={mockCancel} isOpen={isOpen} save={mockSave} />
  );

  beforeEach(() => {
    mockSave.mockClear();
    mockCancel.mockClear();
  });

  it('matches the snapshot when modal is open', () => {
    const { asFragment } = setup()
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render when isOpen is false', () => {
    setup(false);
    expect(screen.queryByText(/enable more than 10 labels/i)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    setup();
    expect(screen.getByText(/enable more than 10 labels/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    setup();
    const input = screen.getByLabelText(/additional labels/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'label1, label2' } });
    expect(input.value).toBe('label1, label2');
  });

  it('calls save function with input value on save button click', () => {
    setup();
    const input = screen.getByLabelText(/additional labels/i);
    fireEvent.change(input, { target: { value: 'label1, label2' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockSave).toHaveBeenCalledWith('label1, label2');
  });

  it('calls cancel function on cancel button click', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockCancel).toHaveBeenCalled();
  });
});

