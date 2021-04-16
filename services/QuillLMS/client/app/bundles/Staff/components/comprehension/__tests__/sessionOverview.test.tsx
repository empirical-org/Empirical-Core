import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import SessionOverview from '../activitySessions/sessionOverview';

const sessionData = require('./mockData/sessionData.json');

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
  location: createLocation(''),
  sessionData: sessionData,
  activity: {}
}

describe('SessionOverview component', () => {
  const container = shallow(<SessionOverview {...mockProps} />);

  it('should render SessionOverview', () => {
    expect(container).toMatchSnapshot();
  });
});
