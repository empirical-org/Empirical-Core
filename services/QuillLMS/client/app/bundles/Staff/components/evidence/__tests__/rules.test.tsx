import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import Rules from '../configureRules/rules';
import 'whatwg-fetch';

const mockProps = {
  activityId: '17',
  prompt: [{id: 1, conjunction: 'because', text: 'test', max_attempts: 5, max_attempts_feedback: 'good try!'}],
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: createMemoryHistory(),
  location: createLocation('')
}

describe('Rules component', () => {
  const container = shallow(<Rules {...mockProps} />);

  it('should render Rules', () => {
    expect(container).toMatchSnapshot();
  });
});
