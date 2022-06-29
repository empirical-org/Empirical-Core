import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import Model from '../semanticRules/model';

import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {
      activityId: '17',
      modelId: '1'
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('Model component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <Model {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render Model', () => {
    expect(container.find(Model).length).toEqual(1);
  });
});
