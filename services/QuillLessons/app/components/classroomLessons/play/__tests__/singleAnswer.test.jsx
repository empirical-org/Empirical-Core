import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import SingleAnswer, { PROJECT } from '../singleAnswer';
import { singleAnswerProps } from './data'

const submissions = {
  student:
    {
      data: "Blah",
      timestamp: "2020-06-15T20:02:41.677Z"
    }
  }

const selectedSubmissionOrder = ['student']

const selectedSubmissions = { student: true }

describe('SingleAnswer component', () => {
  describe('student view', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: "http://localhost:8090/#/play/class-lessons/-KsJlSHlJ9G0rlVlRIfk?&classroom_unit_id=prvw-dc21ddd3-c766-4a57-8523-3937d5de6c30&student=student"
      }
    });

    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} mode={PROJECT} selected_submissions={selectedSubmissions} selected_submission_order={selectedSubmissionOrder} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })

  describe('projector view', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: "http://localhost:8090/#/play/class-lessons/-KsJlSHlJ9G0rlVlRIfk?&classroom_unit_id=prvw-dc21ddd3-c766-4a57-8523-3937d5de6c30&projector=true"
      }
    });

    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} mode={PROJECT} selected_submissions={selectedSubmissions} selected_submission_order={selectedSubmissionOrder} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
