import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import ListBlanks, { PROJECT } from '../listBlanks';
import { listBlanksProps } from './data';

const submissions = {
  student: {
    data: {
      0: "Skip",
      1: "Run",
      2: "Jump"
    },
    timestamp: "2020-06-23T14:56:41.181Z"
  }
}

const selectedSubmissionOrder = ["student#0", "student#2"]

const selectedSubmissions = {"student#0": true, "student#2": true}

describe('ListBlanks component', () => {
  describe('student view', () => {
    const mockGetParameterByName = jest.fn().mockReturnValue('student')
    jest.mock('../../../../libs/getParameterByName', () => ({
      default: mockGetParameterByName
    }))

    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<ListBlanks {...listBlanksProps} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer', () => {
      it('renders', () => {
        const wrapper = mount(<ListBlanks {...listBlanksProps} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer and the teacher is having them retry part of it', () => {
      it('renders', () => {
        const retrySubmissions = {...submissions}
        retrySubmissions.student.data[1] = ''
        const wrapper = mount(<ListBlanks {...listBlanksProps} submissions={retrySubmissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<ListBlanks {...listBlanksProps} mode={PROJECT} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })

  describe('projector view', () => {
    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<ListBlanks {...listBlanksProps} projector={true} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<ListBlanks {...listBlanksProps} mode={PROJECT} projector={true} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
