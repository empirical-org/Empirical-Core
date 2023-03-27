import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import SingleAnswer, { PROJECT } from '../singleAnswer';
import { singleAnswerProps } from './data';

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
    const mockGetParameterByName = jest.fn().mockReturnValue('student')
    jest.mock('../../../../libs/getParameterByName', () => ({
      default: mockGetParameterByName
    }))

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
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} mode={PROJECT} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })

  describe('projector view', () => {
    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} projector={true} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<SingleAnswer {...singleAnswerProps} mode={PROJECT} projector={true} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
