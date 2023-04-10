import { mount } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DefaultReactQueryClient, Input } from '../../../../Shared/index';
import ModelForm from '../semanticRules/modelForm';

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

const queryClient = new DefaultReactQueryClient();

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
