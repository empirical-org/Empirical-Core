import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import LockerApp from '../components/locker/lockerApp';

const queryClient = new QueryClient()

const LockerAppClient = (props) => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route render={() => <LockerApp {...props} />} path="/" />
    </HashRouter>
  </QueryClientProvider>
);

export default LockerAppClient
