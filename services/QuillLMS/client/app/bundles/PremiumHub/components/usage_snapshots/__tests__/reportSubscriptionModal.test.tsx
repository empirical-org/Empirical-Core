import * as React from 'react';
import { render, fireEvent, screen, } from '@testing-library/react';
import ReportSubscriptionModal from '../reportSubscriptionModal';

describe('<ReportSubscriptionModal />', () => {
  const mockSave = jest.fn();
  const mockCancel = jest.fn();
  const existingPdfSubscription = { frequency: 'Weekly' };

  const renderComponent = (isOpen: boolean, subscription = null) =>
    render(
      <ReportSubscriptionModal
        cancel={mockCancel}
        existingPdfSubscription={subscription}
        isOpen={isOpen}
        save={mockSave}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('matches the component snapshot', () => {
    const { asFragment } = renderComponent(true, existingPdfSubscription);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders when isOpen is true', () => {
    renderComponent(true)
    expect(screen.getByText('Subscribe to this report')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    renderComponent(false)
    expect(screen.queryByText('Subscribe to this report')).toBeNull();
  });

  test('initial state with existing subscription', () => {
    renderComponent(true, existingPdfSubscription)
    expect(screen.getByLabelText('On')).toBeChecked();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });

  test('sets subscription status to default frequency when clicked', () => {
    renderComponent(true, null)
    fireEvent.click(screen.getByLabelText('On'));
    expect(screen.getByLabelText('On')).toBeChecked();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  test('calls save function with correct arguments on save click', () => {
    renderComponent(true, existingPdfSubscription)
    fireEvent.click(screen.getByText('Save'));
    expect(mockSave).toHaveBeenCalledWith(true, 'Weekly', existingPdfSubscription);
  });

  test('calls cancel function on cancel click', () => {
    renderComponent(true, existingPdfSubscription)
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalled();
  });

});

