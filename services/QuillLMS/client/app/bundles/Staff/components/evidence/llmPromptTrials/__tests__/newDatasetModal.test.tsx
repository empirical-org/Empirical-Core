import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NewDatasetModal from '../newDatasetModal';
import { uploadDataset } from '../../../../utils/evidence/genAIAPIs';

jest.mock('../../../../utils/evidence/genAIAPIs', () => ({
  uploadDataset: jest.fn(),
}));

const mockStemVault = {
  id: 1,
  activity_id: 1,
  conjunction: 'because',
  datasets: [],
  prompt_id: 1,
  stem: 'Sample Stem',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-02T00:00:00Z',
};

const renderComponent = (closeModal: jest.Mock) => {
  return render(
    <NewDatasetModal closeModal={closeModal} stemVault={mockStemVault} />
  );
};

describe('NewDatasetModal', () => {
  const closeModalMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with the correct elements', () => {
    renderComponent(closeModalMock);

    expect(screen.getByText('New Dataset')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('allows file selection and note input', async () => {
    const user = userEvent.setup();
    renderComponent(closeModalMock);

    const fileInput = screen.getByLabelText(/file/i);
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    await user.upload(fileInput, file);

    const notesInput = screen.getByLabelText('Notes');
    await user.type(notesInput, 'Sample notes');

    expect(fileInput.files[0]).toBe(file);
    expect((notesInput as HTMLTextAreaElement).value).toBe('Sample notes');
  });

  it('calls uploadDataset on Upload button click', async () => {
    const user = userEvent.setup();
    renderComponent(closeModalMock);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    await user.upload(screen.getByLabelText(/file/i), file);
    await user.type(screen.getByLabelText('Notes'), 'Sample notes');

    await user.click(screen.getByText('Upload'));

    expect(uploadDataset).toHaveBeenCalledWith(
      mockStemVault,
      file,
      'Sample notes',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('displays error message when upload fails', async () => {
    const user = userEvent.setup();
    renderComponent(closeModalMock);

    await user.upload(screen.getByLabelText(/file/i), new File(['test'], 'test.csv', { type: 'text/csv' }));
    await user.type(screen.getByLabelText('Notes'), 'Sample notes');

    const errorMessage = 'Failed to upload dataset';
    (uploadDataset as jest.Mock).mockImplementation(
      (stemVault, file, notes, successFn, errorFn) => {
        errorFn(errorMessage);
      }
    );

    await user.click(screen.getByText('Upload'));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls closeModal when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent(closeModalMock);

    await user.click(screen.getByText('Cancel'));

    expect(closeModalMock).toHaveBeenCalled();
  });

  it('reloads the page on successful upload', async () => {
    const user = userEvent.setup();
    renderComponent(closeModalMock);

    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    (uploadDataset as jest.Mock).mockImplementation(
      (stemVault, file, notes, successFn) => {
        successFn();
      }
    );

    await user.click(screen.getByText('Upload'));

    expect(reloadMock).toHaveBeenCalled();
  });
});
