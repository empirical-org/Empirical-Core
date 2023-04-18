import { mount } from 'enzyme';
import * as React from 'react';

import CustomActivityPack from '../index';
import { activities } from './data';

jest.mock('query-string', () => ({
  default: {
    parseUrl: jest.fn(() => ({ query: {} })),
    stringifyUrl: jest.fn(() => '')
  }
})
)

describe('CustomActivityPack Index component', () => {

  it('should render', () => {
    const wrapper = mount(<CustomActivityPack
      clickContinue={() => {}}
      passedActivities={activities}
      selectedActivities={[]}
      setSelectedActivities={() => {}}
      toggleActivitySelection={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
