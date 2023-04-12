import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import 'whatwg-fetch';

import SessionOverview from '../activitySessions/sessionOverview';

const sessionData = require('../__mocks__/sessionData.json');

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
