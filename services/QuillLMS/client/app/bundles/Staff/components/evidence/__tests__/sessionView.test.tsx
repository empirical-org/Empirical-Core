import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import SessionView from '../activitySessions/sessionView';

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

describe('SessionView component', () => {
  const container = shallow(<SessionView {...mockProps} />);

  it('should render SessionView', () => {
    expect(container).toMatchSnapshot();
  });
});
