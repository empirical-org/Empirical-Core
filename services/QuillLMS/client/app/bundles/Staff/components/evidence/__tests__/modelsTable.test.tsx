import * as React from 'react';
import { shallow } from 'enzyme';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared/index';
import ModelsTable from '../semanticRules/modelsTable';

const queryClient = new DefaultReactQueryClient();

jest.mock('../../../helpers/evidence/miscHelpers', () => ({
  titleCase: jest.fn().mockImplementation(() => {
    return '';
  }),
}));
const { firstBy } = jest.requireActual('thenby');

describe('LabelsTable component', () => {
  const mockProps = {
    activityId: '17',
    prompt: { id: 1 }
  }
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ModelsTable {...mockProps} />
    </QueryClientProvider>
  );

  it('should render ModelsTable', () => {
    expect(container).toMatchSnapshot();
  });
});
