import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter, Route } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../Shared';
import EvidenceLanding from '../components/evidence/EvidenceLanding';

const queryClient = new DefaultReactQueryClient();

const EvidenceIndex = () => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route component={EvidenceLanding} path="/" />
    </HashRouter>
  </QueryClientProvider>
);

export default EvidenceIndex
