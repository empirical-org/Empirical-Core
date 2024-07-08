import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
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

const history = createMemoryHistory()

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history,
  location: history.location
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
