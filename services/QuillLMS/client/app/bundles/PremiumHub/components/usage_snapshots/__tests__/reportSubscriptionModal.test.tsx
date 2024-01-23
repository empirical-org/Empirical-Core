import * as React from 'react';
import { render, fireEvent, screen, } from '@testing-library/react';
import ReportSubscriptionModal from '../reportSubscriptionModal';

describe('<ReportSubscriptionModal />', () => {
  const save = jest.fn();
  const cancel = jest.fn();
  const existingPdfSubscription = { frequency: 'Weekly' };

  test('matches the component snapshot', () => {
    const { asFragment } = render(
      <ReportSubscriptionModal
        cancel={cancel}
        existingPdfSubscription={existingPdfSubscription}
        isOpen={true}
        save={save}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('renders when isOpen is true', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={null} isOpen={true} save={save} />);
    expect(screen.getByText('Subscribe to this report')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={null} isOpen={false} save={save} />);
    expect(screen.queryByText('Subscribe to this report')).toBeNull();
  });

  test('initial state with existing subscription', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={existingPdfSubscription} isOpen={true} save={save} />);
    expect(screen.getByLabelText('On')).toBeChecked();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });

  test('sets subscription status to default frequency when clicked', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={null} isOpen={true} save={save} />);
    fireEvent.click(screen.getByLabelText('On'));
    expect(screen.getByLabelText('On')).toBeChecked();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  test('calls save function with correct arguments on save click', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={existingPdfSubscription} isOpen={true} save={save} />);
    fireEvent.click(screen.getByText('Save'));
    expect(save).toHaveBeenCalledWith(true, 'Weekly', existingPdfSubscription);
  });

  test('calls cancel function on cancel click', () => {
    render(<ReportSubscriptionModal cancel={cancel} existingPdfSubscription={existingPdfSubscription} isOpen={true} save={save} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(cancel).toHaveBeenCalled();
  });

});

