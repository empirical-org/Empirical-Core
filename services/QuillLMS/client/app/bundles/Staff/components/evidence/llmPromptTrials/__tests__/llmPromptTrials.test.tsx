import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route } from 'react-router-dom';

import LLMPromptTrials from '../LLMPromptTrials';

import { BECAUSE, BUT, SO } from '../../../../../../constants/evidence';

const queryClient = new QueryClient();

const defaultMatchProps = {
  params: {},
  isExact: true,
  path: '',
  url:''
}

const mockRouterProps = {
  history: {},
  location: {
    pathname: 'llm-prompt-trials'
  }
}

const renderComponent = (activityId = '1', promptConjunction = '') => {
  const matchProps = {
    ...defaultMatchProps,
    params: {
      activityId,
      promptConjunction,
    }
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/activity/${activityId}`]}>
        <Route path="/activity/:activityId">
          <LLMPromptTrials {...mockRouterProps} match={matchProps} />
        </Route>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('LLMPromptTrials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('should display spinner while loading stem vaults', async () => {
    queryClient.setQueryData(['activity-1', '1'], undefined);
    queryClient.setQueryData(['stem-vaults-1', '1'], undefined);

    renderComponent();

    expect(screen.getByAltText('Loading spinner')).toBeInTheDocument();
  });

  it('should render StemVaultSection components when data is available', async () => {
    const mockActivityData = { activity: { id: 1, prompts: [] } };
    const mockStemVaultsData = {
      stemVaults: [
        { conjunction: BECAUSE, id: 1, stem: BECAUSE, datasets: [] },
        { conjunction: BUT, id: 2, stem: BUT, datasets: [] },
        { conjunction: SO, id: 3, stem: SO, datasets: [] },
      ],
    };

    queryClient.setQueryData(['activity-1', '1'], mockActivityData);
    queryClient.setQueryData(['stem-vaults-1', '1'], mockStemVaultsData);

    renderComponent();

    expect(screen.getByText(/Because/)).toBeInTheDocument();
    expect(screen.getByText(/But/)).toBeInTheDocument();
    expect(screen.getByText(/So/)).toBeInTheDocument();
  });

  it('should handle promptConjunction prop and render only relevant section', async () => {
    const mockActivityData = { activity: { id: 1, prompts: [] } };
    const mockStemVaultsData = {
      stemVaults: [{ conjunction: BECAUSE, id: 1, stem: BECAUSE, datasets: [] }],
    };

    queryClient.setQueryData(['activity-1', '1'], mockActivityData);
    queryClient.setQueryData(['stem-vaults-1', '1'], mockStemVaultsData);

    renderComponent('1', BECAUSE);

    expect(screen.getByText(/Because/)).toBeInTheDocument();
    expect(screen.queryByText(/But/)).not.toBeInTheDocument();
    expect(screen.queryByText(/So/)).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const mockActivityData = { activity: { id: 1, prompts: [] } };
    const mockStemVaultsData = {
      stemVaults: [
        { conjunction: BECAUSE, id: 1, stem: BECAUSE, datasets: [] },
        { conjunction: BUT, id: 2, stem: BUT, datasets: [] },
        { conjunction: SO, id: 3, stem: SO, datasets: [] },
      ],
    };

    queryClient.setQueryData(['activity-1', '1'], mockActivityData);
    queryClient.setQueryData(['stem-vaults-1', '1'], mockStemVaultsData);

    const { asFragment } = renderComponent();

    expect(asFragment()).toMatchSnapshot();
  });
});
