import { mount } from 'enzyme';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { DefaultReactQueryClient } from '../../../../Shared/index';
import SemanticLabelsIndex from '../semanticRules/semanticLabelsIndex';

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
