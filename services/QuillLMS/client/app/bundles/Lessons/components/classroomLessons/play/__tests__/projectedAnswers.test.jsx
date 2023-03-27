import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ProjectedAnswers from '../projectedAnswers';

const singleSubmissionProps = {
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

const multipleSubmissionProps = {
  response: {
    0: "Skip",
    1: "Run",
    2: "Jump"
  },
  selectedSubmissionOrder: ["student#0", "student#2"],
  selectedSubmissions: {
    "student#0": true,
    "student#2": true
  },
  submissions: {
    student: {
      data: {
        0: "Skip",
        1: "Run",
        2: "Jump"
      },
      timestamp: "2020-06-23T14:56:41.181Z"
    }
  }
}

describe('ProjectedAnswers component', () => {

  describe("when each student submits a single response", () => {
    it('renders on the student screen', () => {
      const wrapper = mount(<ProjectedAnswers {...singleSubmissionProps} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('renders on the projector screen', () => {
      const wrapper = mount(<ProjectedAnswers {...singleSubmissionProps} projector={true} response={null} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe("when each student submits multiple responses", () => {
    it('renders on the student screen', () => {
      const wrapper = mount(<ProjectedAnswers {...multipleSubmissionProps} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('renders on the projector screen', () => {
      const wrapper = mount(<ProjectedAnswers {...multipleSubmissionProps} projector={true} response={null} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })


})
