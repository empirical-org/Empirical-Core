import * as React from 'react'
import { mount } from 'enzyme';

import CustomActivityPack from '../index'

describe('CustomActivityPack Index component', () => {

  it('should render', () => {
    const wrapper = mount(<CustomActivityPack
      clickContinue={() => {}}
      passedActivities={[]}
      selectedActivities={[]}
      setSelectedActivities={() => {}}
      toggleActivitySelection={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
