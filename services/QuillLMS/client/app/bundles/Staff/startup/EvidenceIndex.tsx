import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter, Route, } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import { DefaultReactQueryClient } from '../../Shared';
import EvidenceLanding from '../components/evidence/EvidenceLanding';

const queryClient = new DefaultReactQueryClient();

const EvidenceIndex = () => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <CompatRouter>
        <Route component={EvidenceLanding} path="/" />
      </CompatRouter>
    </HashRouter>
  </QueryClientProvider>
);

export default EvidenceIndex
