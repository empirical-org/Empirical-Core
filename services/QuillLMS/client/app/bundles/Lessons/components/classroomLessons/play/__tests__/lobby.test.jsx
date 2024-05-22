import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

import Lobby from '../lobby';

const projectorProps = {
  data: {
    absentTeacherState: false,
    classroom_name: "Quill Classroom",
    current_slide: "0",
    edition_id: "-L1uY6dpgZ-Il6ZuquY6",
    followUpActivityName: "Follow-up Activity for Lesson 1: Adverbs",
    id: "2897973-KsKmzdhUYHYCB6EDKz_",
    presence: {
      "fkFfOdAvTy-QkfjAQhzcpQ": true
    },
    startTime: "2020-06-11T13:17:42.823Z",
    student_ids: {
      5204393: true,
      5204394: true,
      5204396: true,
      5204397: true
    },
    students: {
      "GunvLfWJk7FK_aBH99WukA": "Harper Lee",
      "S9Fibh5Nkh21LhPZLGwQ9w": "William Shakespeare",
      "fkFfOdAvTy-QkfjAQhzcpQ": "Maya Angelou",
      "gduTfHrLpDdondOlx7-_Ag": "James Joyce"
    },
    supportingInfo: "https://assets.quill.org/documents/quill_lessons_pdf/adverbs/lesson1_adverbs.pdf",
    teacher_ids: {
      5204392: true
    },
    teacher_name: "Demo Teacher",
    timestamps: {
      0: "2020-06-11T13:17:53.121Z"
    }
  },
  projector: true,
  title: "Adverbs"
}


describe('Lobby component', () => {

  describe('projector view', () => {

    it('renders', () => {
      const wrapper = mount(<Lobby {...projectorProps} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

  })

  describe('student view', () => {

    it('renders', () => {
      const wrapper = mount(<Lobby {...projectorProps} projector={false} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

  })

})
