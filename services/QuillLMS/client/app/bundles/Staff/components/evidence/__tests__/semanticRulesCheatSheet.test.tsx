import { shallow } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import SemanticRulesCheatSheet from '../semanticRules/semanticRulesCheatSheet';

const queryClient = new DefaultReactQueryClient();

describe('SemanticRulesCheatSheet component', () => {
  const mockProps = {
    match: {
      params: {
        activityId: "1",
        promptId: "1"
      }
    }
  }

  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <SemanticRulesCheatSheet {...mockProps} />
    </QueryClientProvider>
  );

  it('should render SemanticRulesCheatSheet', () => {
    expect(container).toMatchSnapshot();
  });
});
