import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'

import ModelForm from '../semanticRules/modelForm';
import { Input } from '../../../../Shared/index';

const mockProps = {
  match: {
    params: {
      activityId: '17',
      promptId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: {}
}

const queryClient = new QueryClient()

describe('ModelForm component', () => {
  const container = mount(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <MemoryRouter>
        <ModelForm {...mockProps} />
      </MemoryRouter>
    </QueryClientProvider>
  );
  it('should render ModelForm', () => {
    expect(container.find(ModelForm).length).toEqual(1);
  });
  it('should render one Input component', () => {
    expect(container.find(Input).length).toEqual(1);
  });
});
