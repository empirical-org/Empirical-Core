import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter, Route } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import { DefaultReactQueryClient } from '../../Shared';
import LockerApp from '../components/locker/lockerApp';

const queryClient = new DefaultReactQueryClient();

const LockerAppClient = (props) => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <CompatRouter>
        <Route path="/" render={() => <LockerApp {...props} />} />
      </CompatRouter>
    </HashRouter>
  </QueryClientProvider>
);

export default LockerAppClient
