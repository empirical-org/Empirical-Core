import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import SessionsIndex from '../activitySessions/sessionsIndex';

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

describe('SessionsIndex component', () => {
  const container = shallow(<SessionsIndex {...mockProps} />);

  it('should render SessionsIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
