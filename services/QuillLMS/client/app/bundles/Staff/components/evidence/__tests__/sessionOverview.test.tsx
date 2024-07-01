import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import 'whatwg-fetch';

import SessionOverview from '../activitySessions/sessionOverview';
import sessionData from '../__mocks__/sessionData.json';

const history = createMemoryHistory()

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history,
  location: history.location,
  sessionData: sessionData,
  activity: {}
}

describe('SessionOverview component', () => {
  const container = shallow(<SessionOverview {...mockProps} />);

  it('should render SessionOverview', () => {
    expect(container).toMatchSnapshot();
  });
});
