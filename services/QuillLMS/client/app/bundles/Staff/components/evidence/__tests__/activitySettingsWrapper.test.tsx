import { mount } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import ActivitySettingsWrapper from '../configureSettings/activitySettingsWrapper';

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
