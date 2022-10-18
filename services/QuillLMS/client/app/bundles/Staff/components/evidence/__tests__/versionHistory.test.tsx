import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared';
import VersionHistory from '../versionHistory/versionHistory';

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
};

const queryClient = new DefaultReactQueryClient();

describe('VersionHistory component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <VersionHistory {...mockProps} />
    </QueryClientProvider>
  );

  it('should render VersionHistory', () => {
    expect(container).toMatchSnapshot();
  });
});
