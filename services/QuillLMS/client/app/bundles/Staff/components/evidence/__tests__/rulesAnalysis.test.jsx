import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query'
import 'whatwg-fetch';

import { defaultQueryClientOptions } from '../../../Shared';
import RulesAnalysis from '../rulesAnalysis/rulesAnalysis';

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
})
)

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


const queryClient = new QueryClient({ defaultOptions: defaultQueryClientOptions })

describe('RulesAnalysis component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RulesAnalysis {...mockProps} />
    </QueryClientProvider>
  );

  it('should render RulesAnalysis', () => {
    expect(container).toMatchSnapshot();
  });
});
