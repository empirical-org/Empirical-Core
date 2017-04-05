import React from 'react';
import { shallow } from 'enzyme';

import StudentScores from '../student_scores.jsx'
import IconRow from '../icon_row.jsx'

const data = {
  user: {
    name: 'Albert Camus'
  },
  results: []
}

for (let x=0; x<11; x++) {
  data.results.push({state: 'finished'})
  data.results.push({state: 'unstarted'})
}

describe('StudentScores component', () => {

  it('should render a tenth as many icon rows as it has data.props.results, rounded up', () => {
    const wrapper = shallow(
      <StudentScores data={data}
                     premium_state={'trial'} />)

    const numberOfResults = wrapper.instance().props.data.results.length
    expect(wrapper.find(IconRow).length).toEqual(Math.ceil(numberOfResults/10))
  })

})
