import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import 'whatwg-fetch';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import RegexRulesIndex from '../regexRules/regexRulesIndex';

const queryClient = new DefaultReactQueryClient();

const { firstBy } = jest.requireActual('thenby');

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
  location: history.location,
}

describe('RegexRulesIndex component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RegexRulesIndex {...mockProps} />
    </QueryClientProvider>
  );

  it('should render RegexRulesIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
