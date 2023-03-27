import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter, Route } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../Shared';
import LockerApp from '../components/locker/lockerApp';

const queryClient = new DefaultReactQueryClient();

const LockerAppClient = (props) => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route path="/" render={() => <LockerApp {...props} />} />
    </HashRouter>
  </QueryClientProvider>
);

export default LockerAppClient
