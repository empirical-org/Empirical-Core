import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared';
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


const queryClient = new DefaultReactQueryClient();

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
