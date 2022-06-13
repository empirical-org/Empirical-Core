import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'
import CustomActivityPack from '../index'

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
