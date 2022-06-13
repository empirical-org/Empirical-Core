import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import FillInTheBlank, { PROJECT } from '../fillInTheBlank';
import { fillInTheBlankProps } from './data'

const submissions = {
  student:
    {
      data: "Blah",
      timestamp: "2020-06-15T20:02:41.677Z"
    }
}

const selectedSubmissionOrder = ['student']

const selectedSubmissions = { student: true }

describe('FillInTheBlank component', () => {
  describe('student view', () => {
    const mockGetParameterByName = jest.fn().mockReturnValue('student')
    jest.mock('../../../../libs/getParameterByName', () => ({
      default: mockGetParameterByName
    }))

    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<FillInTheBlank {...fillInTheBlankProps} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer', () => {
      it('renders', () => {
        const wrapper = mount(<FillInTheBlank {...fillInTheBlankProps} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<FillInTheBlank {...fillInTheBlankProps} mode={PROJECT} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })

  describe('projector view', () => {
    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<FillInTheBlank {...fillInTheBlankProps} projector={true} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<FillInTheBlank {...fillInTheBlankProps} mode={PROJECT} projector={true} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
