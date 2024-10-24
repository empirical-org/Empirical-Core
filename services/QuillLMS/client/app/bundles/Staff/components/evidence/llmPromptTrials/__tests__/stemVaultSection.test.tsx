import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import StemVaultSection from '../stemVaultSection';
import { StemVaultInterface } from '../../../../interfaces/evidenceInterfaces';

jest.mock('../newDatasetModal', () => jest.fn(({ closeModal }) => (
  <div>
    <button onClick={closeModal}>Close Modal</button>
    <div>NewDatasetModal</div>
  </div>
)));

const mockStemVault: StemVaultInterface = {
  activity_id: 1,
  conjunction: 'because',
  created_at: '2023-01-01T12:00:00Z',
  datasets: [
    {
      id: 1,
      optimal_count: 10,
      suboptimal_count: 5,
      version: 1,
      created_at: '2023-01-01T12:00:00Z',
      notes: 'Sample dataset notes',
      trial_count: 3,
    },
  ],
  id: 1,
  prompt_id: 1,
  stem: 'Sample Stem',
  updated_at: '2023-01-02T12:00:00Z',
};

const renderComponent = (stemVault: StemVaultInterface) => {
  return render(
    <StemVaultSection stemVault={stemVault} />
  );
};

describe('StemVaultSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the section with the correct title and dataset table', () => {
    renderComponent(mockStemVault);

    expect(screen.getByText('Because Datasets')).toBeInTheDocument();

    expect(screen.getByText('Dataset 1')).toBeInTheDocument();
    expect(screen.getByText('Sample dataset notes')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Total test responses (10 + 5)
    expect(screen.getByText('10')).toBeInTheDocument(); // Optimal test responses
    expect(screen.getByText('5')).toBeInTheDocument(); // Suboptimal test responses
    expect(screen.getByText('3')).toBeInTheDocument(); // Trials
  });

  it('opens the NewDatasetModal when the New button is clicked', () => {
    renderComponent(mockStemVault);

    fireEvent.click(screen.getByText('New'));

    expect(screen.getByText('NewDatasetModal')).toBeInTheDocument();
  });

  it('closes the NewDatasetModal when the close button in the modal is clicked', () => {
    renderComponent(mockStemVault);

    fireEvent.click(screen.getByText('New'));

    fireEvent.click(screen.getByText('Close Modal'));

    expect(screen.queryByText('NewDatasetModal')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent(mockStemVault);

    expect(asFragment()).toMatchSnapshot();
  });
});
