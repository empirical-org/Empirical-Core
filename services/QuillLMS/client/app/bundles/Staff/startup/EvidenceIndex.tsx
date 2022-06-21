import React from 'react';
import { HashRouter, Route,  } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import EvidenceLanding from '../components/evidence/EvidenceLanding';
import { defaultQueryClientOptions } from '../../Shared';

const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

const EvidenceIndex = () => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route component={EvidenceLanding} path="/" />
    </HashRouter>
  </QueryClientProvider>
);

export default EvidenceIndex
