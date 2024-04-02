import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import 'whatwg-fetch';

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
  const container = shallow(<ActivitySettings {...mockProps} />);

  it('should render ActivitySettings', () => {
    expect(container).toMatchSnapshot();
  });
});
