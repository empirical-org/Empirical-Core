import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProjectedAnswers from '../projectedAnswers';

const props = {
  response: "We waited in line at the store. <strong>The</strong> line was very long!",
  selectedSubmissionOrder: ["student"],
  selectedSubmissions: {
    student: true
  },
  submissions: {
    student: {
      data: "We waited in line at the store. <strong>The</strong> line was very long!",
      timestamp: "2020-06-18T13:22:44.449Z"
    }
  }
}

describe('ProjectedAnswers component', () => {

  it('renders on the student screen', () => {
    const wrapper = mount(<ProjectedAnswers {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders on the projector screen', () => {
    const wrapper = mount(<ProjectedAnswers {...props} projector={true} response={null} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
