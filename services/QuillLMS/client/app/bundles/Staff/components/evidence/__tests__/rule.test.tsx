import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { QueryClientProvider } from 'react-query';

import 'whatwg-fetch';
import { DefaultReactQueryClient } from '../../../../Shared';
import Rule from '../configureRules/rule';

const mockProps = {
  match: {
    params: {
      activityId: '1',
      ruleSetId: '104'
    },
    isExact: true,
    path: '',
    url:'`https://comprehension-247816.appspot.com/api/activities/:activityId/rulesets/:ruleSetId.json/`'
  },
  history: createMemoryHistory(),
  location: createLocation('')
};

const fields = [
  'Name',
  'Feedback',
  'Because',
  'But',
  'So'
];


const queryClient = new DefaultReactQueryClient();

describe('Rule component', () => {
  const container = shallow(
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Rule {...mockProps} />
    </QueryClientProvider>
  );

  it('should render Rule', () => {
    expect(container).toMatchSnapshot();
  });
});
