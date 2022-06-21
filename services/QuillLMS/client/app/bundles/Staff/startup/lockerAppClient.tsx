import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { defaultQueryClientOptions} from '../../Shared';
import LockerApp from '../components/locker/lockerApp';

const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

const LockerAppClient = (props) => (
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <HashRouter>
      <Route path="/" render={() => <LockerApp {...props} />} />
    </HashRouter>
  </QueryClientProvider>
);

export default LockerAppClient
