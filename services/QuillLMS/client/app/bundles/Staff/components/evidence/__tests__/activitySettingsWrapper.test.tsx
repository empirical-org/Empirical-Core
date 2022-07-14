import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import * as _ from 'lodash'
import { QueryClientProvider } from 'react-query'

import ActivitySettingsWrapper from '../configureSettings/activitySettingsWrapper';
import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {
      activityId: 1
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('ActivitySettingsWrapper component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <ActivitySettingsWrapper {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render ActivitySettingsWrapper', () => {
    expect(container.find(ActivitySettingsWrapper).length).toEqual(1);
  });
});
