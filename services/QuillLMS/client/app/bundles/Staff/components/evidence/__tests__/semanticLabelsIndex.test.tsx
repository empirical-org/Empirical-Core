import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'

import SemanticLabelsIndex from '../semanticRules/semanticLabelsIndex';
import { DefaultReactQueryClient } from '../../../../Shared/index';

const queryClient = new DefaultReactQueryClient();


const mockProps = {
  match: {
    params: {},
    isExact: true,
    path: '',
    url:''
  },
  history: {},
  location: {
    pathname: 'but'
  }
}

describe('SemanticLabelsIndex component', () => {
  const container = mount(
    <MemoryRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <SemanticLabelsIndex {...mockProps} />
      </QueryClientProvider>
    </MemoryRouter>
  );
  it('should render SemanticLabelsIndex', () => {
    expect(container.find(SemanticLabelsIndex).length).toEqual(1);
  });
});
