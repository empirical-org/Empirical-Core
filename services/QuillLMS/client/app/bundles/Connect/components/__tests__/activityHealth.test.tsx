import * as React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import createStore from '../../utils/configureStore';
import ActivityHealth from '../activityHealth/activityHealth';
import 'whatwg-fetch';

const mockProps = {
  activityHealth: {
    flag: 'All Flags'
  },
  dispatch: jest.fn()
}

describe('ActivityHealth component', () => {
  const store = createStore();

  it('should render ActivityHealth', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <ActivityHealth {...mockProps} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
