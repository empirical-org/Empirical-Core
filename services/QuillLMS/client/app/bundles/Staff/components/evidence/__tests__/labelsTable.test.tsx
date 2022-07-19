import * as React from 'react';
import { shallow } from 'enzyme';

import LabelsTable from '../semanticRules/labelsTable';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

describe('LabelsTable component', () => {
  const mockProps = {
    activityId: '17',
    prompt: { id: 1, conjunction: 'because' }
  }
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <LabelsTable {...mockProps} />
    </QueryClientProvider>
  );

  it('should render LabelsTable', () => {
    expect(container).toMatchSnapshot();
  });
});
