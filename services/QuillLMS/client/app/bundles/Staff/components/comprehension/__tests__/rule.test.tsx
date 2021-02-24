import * as React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import Rule from '../configureRules/rule';
import 'whatwg-fetch';

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

describe('Rule component', () => {
  const container = mount(<Rule {...mockProps} />);

  it('should render Rule', () => {
    expect(container).toMatchSnapshot();
  });
});
