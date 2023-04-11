import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Multistep, { PROJECT } from '../multistep';
import { multistepProps } from './data';

const submissions = {
  student: {
    data: {
      "After finding out about the secret spot and walking three miles to get there.": "Fragment",
      "Before he went home, he took photographs of all his friends and said goodbye.": "Complete sentence",
      "Even though he had practiced every night and he was a talented singer.": "Fragment"
    },
    timestamp: "2020-06-25T15:12:30.233Z"
  }
}

const selectedSubmissionOrder = ["student#Before he went home, he took photographs of all his friends and said goodbye.", "student#After finding out about the secret spot and walking three miles to get there.", "student#Even though he had practiced every night and he was a talented singer."]

const selectedSubmissions = {
  "student#After finding out about the secret spot and walking three miles to get there.": true,
  "student#Before he went home, he took photographs of all his friends and said goodbye.": true,
  "student#Even though he had practiced every night and he was a talented singer.": true
}

describe('Multistep component', () => {
  describe('student view', () => {
    const mockGetParameterByName = jest.fn().mockReturnValue('student')
    jest.mock('../../../../libs/getParameterByName', () => ({
      default: mockGetParameterByName
    }))

    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<Multistep {...multistepProps} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer', () => {
      it('renders', () => {
        const wrapper = mount(<Multistep {...multistepProps} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when the student has submitted an answer and the teacher is having them retry part of it', () => {
      it('renders', () => {
        const retrySubmissions = {...submissions}
        retrySubmissions.student.data[1] = ''
        const wrapper = mount(<Multistep {...multistepProps} submissions={retrySubmissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<Multistep {...multistepProps} mode={PROJECT} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })

  describe('projector view', () => {
    describe('inactive', () => {
      it('renders', () => {
        const wrapper = mount(<Multistep {...multistepProps} projector={true} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('when an answer is being displayed', () => {
      it('renders', () => {
        const wrapper = mount(<Multistep {...multistepProps} mode={PROJECT} projector={true} selected_submission_order={selectedSubmissionOrder} selected_submissions={selectedSubmissions} submissions={submissions} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
