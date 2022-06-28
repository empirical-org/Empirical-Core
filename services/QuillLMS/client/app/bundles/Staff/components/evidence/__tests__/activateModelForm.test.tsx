import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import { DefaultReactQueryClient } from '../../../../Shared/index';
import ActivateModelForm from '../semanticRules/activateModelForm';

const queryClient = new DefaultReactQueryClient();

const mockProps = {
  match: {
    params: {
      modelId: '1',
      activityId: '17',
      promptId: '1'
    },
    isExact: true,
    path: '',
    url:''
  }
}

describe('ActivateModelForm component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <ActivateModelForm {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render ActivateModelForm', () => {
    expect(container.find(ActivateModelForm).length).toEqual(1);
  });
});
