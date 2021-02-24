import * as React from 'react';
import 'whatwg-fetch';
import { mount } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import ActivitySettings from '../configureSettings/activitySettings';

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

describe('ActivitySettings component', () => {
  const container = mount(<ActivitySettings {...mockProps} />);

  it('should render ActivitySettings', () => {
    expect(container).toMatchSnapshot();
  });
});
