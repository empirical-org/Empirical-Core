import * as React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import Rules from '../configureRules/rules';
import 'whatwg-fetch';

const mockProps = {
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
  const container = mount(<Rules {...mockProps} />);

  it('should render Rules', () => {
    expect(container).toMatchSnapshot();
  });
});
