import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import TurkSessions from '../gatherResponses/turkSessions';
import 'whatwg-fetch';

describe('TurkSessions component', () => {
  const mockProps = {
    match: {
      params: { activityId: '1' },
      isExact: true,
      path: '',
      url:''
    },
    history: createMemoryHistory(),
    location: createLocation('')
  }
  const container = shallow(<TurkSessions {...mockProps} />);

  it('should render TurkSessions', () => {
    expect(container).toMatchSnapshot();
  });
});
