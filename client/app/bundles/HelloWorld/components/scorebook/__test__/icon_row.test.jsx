import React from 'react';
import { shallow } from 'enzyme';

import IconRow from '../icon_row.jsx'
import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip'

const data = []

for (let x=0; x<11; x++) {
  data.push({state: 'finished', id: x})
  data.push({state: 'unstarted', id: x+11})
}

describe('IconRow component', () => {

  it('should render as many ActivityIconWithTooltips as it has datum', () => {
    const wrapper = shallow(
      <IconRow data={data}
              premium_state={'trial'} />)

    const numberOfDatum = wrapper.instance().props.data.length
    expect(wrapper.find(ActivityIconWithTooltip).length).toEqual(numberOfDatum)
  })
})
