import * as React from 'react';
import { shallow } from 'enzyme';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared/index';
import UniversalRulesIndex from '../universalRules/universalRules';

const queryClient = new DefaultReactQueryClient();
const mockUpdateRuleOrders = jest.fn().mockImplementation(() => Promise.resolve({}))
jest.mock('../../../utils/evidence/ruleAPIs', () => ({
  updateRuleOrders: mockUpdateRuleOrders
}));

describe('UniversalRulesIndex component', () => {
  const mockProps = {
    match: {
      params: {},
      isExact: true,
      path: '',
      url:''
    },
    history: {},
    location: {
      pathname: 'universal-rules'
    }
  }

  const component = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <UniversalRulesIndex {...mockProps} />
    </QueryClientProvider>
  );

  it('should render UniversalRulesIndex', () => {
    expect(component).toMatchSnapshot();
  });
});
