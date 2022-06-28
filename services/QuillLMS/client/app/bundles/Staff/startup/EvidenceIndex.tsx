import React from 'react';
import { HashRouter, Route,  } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'

import EvidenceLanding from '../components/evidence/EvidenceLanding';
import { DefaultReactQueryClient } from '../../Shared';

const queryClient = new DefaultReactQueryClient();

const EvidenceIndex = () => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route component={EvidenceLanding} path="/" />
    </HashRouter>
  </QueryClientProvider>
);

export default EvidenceIndex
