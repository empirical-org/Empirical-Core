import { shallow } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';

import 'whatwg-fetch';
import createStore from '../../utils/configureStore';
import ActivityHealth from '../activityHealth/activityHealth';

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
