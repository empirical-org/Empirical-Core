import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import HealthDashboard from '../healthDashboards/activityHealthDashboard';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: createMemoryHistory(),
  location: createLocation('')
}

describe('HealthDashboard component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <HealthDashboard {...mockProps} />
    </QueryClientProvider>
  );

  it('should render HealthDashboard', () => {
    expect(container).toMatchSnapshot();
  });
});
