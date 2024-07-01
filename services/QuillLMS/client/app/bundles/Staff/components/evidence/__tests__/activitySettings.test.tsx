import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import 'whatwg-fetch';

import ActivitySettings from '../configureSettings/activitySettings';

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
}

describe('ActivitySettings component', () => {
  const container = shallow(<ActivitySettings {...mockProps} />);

  it('should render ActivitySettings', () => {
    expect(container).toMatchSnapshot();
  });
});
