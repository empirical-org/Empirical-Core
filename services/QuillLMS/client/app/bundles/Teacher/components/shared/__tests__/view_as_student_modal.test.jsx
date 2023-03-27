import { mount } from 'enzyme';
import React from 'react';
import { DropdownInput } from '../../../../Shared/index';

import ViewAsStudentModal from '../view_as_student_modal';

const classrooms = [
  {
    "students": [
      {
        "name": "Maya Angelou",
        "id": 5204397
      },
      {
        "name": "James Joyce",
        "id": 5204396
      },
      {
        "name": "Harper Lee",
        "id": 5204394
      },
      {
        "name": "William Shakespeare",
        "id": 5204393
      }
    ],
    "name": "Quill Classroom",
    "created_at": "2019-12-16T20:06:16.025Z",
    "id": 484121
  },
  {
    "students": [
      {
        "name": "Bleep Bloop",
        "id": 5204398
      }
    ],
    "name": "Additional Class",
    "created_at": "2019-12-30T18:58:26.154Z",
    "id": 484122
  },
  {
    "name": "Class With No Students",
    "created_at": "2019-12-31T18:58:26.154Z",
    "id": 484123,
    "students": []
  },
]

describe('ViewAsStudentModal component', () => {
  describe('without a defaultClassroomId', () => {
    const wrapper = mount(
      <ViewAsStudentModal
        classrooms={classrooms}
        close={() => {}}
        handleViewClick={() => {}}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have the most recently created class set as the value of the dropdown input', () => {
      expect(wrapper.find(DropdownInput).props().value.id).toBe(484122)
    })

    it('should not pass the class with no students in the list of options', () => {
      const optionIds = wrapper.find(DropdownInput).props().options.map(opt => opt.id)
      expect(optionIds).toEqual(expect.not.arrayContaining([484123]))
    })

  })

  describe('without a defaultClassroomId', () => {
    const wrapper = mount(
      <ViewAsStudentModal
        classrooms={classrooms}
        close={() => {}}
        defaultClassroomId={classrooms[0].id}
        handleViewClick={() => {}}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should have the class with the default classroom id set as the value of the dropdown input', () => {
      expect(wrapper.find(DropdownInput).props().value).toBe(classrooms[0])
    })

  })

});
