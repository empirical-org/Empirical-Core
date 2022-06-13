import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import LockerApp from '../components/locker/lockerApp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      // 24 hours in minutes
      staleTime: 1440,
    },
  },
});

const LockerAppClient = (props) => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route path="/" render={() => <LockerApp {...props} />} />
    </HashRouter>
  </QueryClientProvider>
);

export default LockerAppClient
