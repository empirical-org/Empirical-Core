import React from 'react';
import { shallow } from 'enzyme';

import { Input, DataTable } from 'quill-component-library/dist/componentLibrary'

import InviteCoteacherModal from '../invite_coteachers_modal'

import { classroomWithStudents, classroomProps } from './test_data/test_data'

describe('InviteCoteacherModal component', () => {

  describe('if a coteacher gets passed', () => {
    const wrapper = shallow(
      <InviteCoteacherModal
        close={() => {}}
        onSuccess={() => {}}
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        coteacher={classroomWithStudents.teachers[1]}
      />
    );

    it('should render InviteCoteacherModal', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a disabled input field', () => {
      expect(wrapper.find(Input).props().disabled).toBe(true)
    })

    it('should render a datatable', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })

  })

  describe('if a coteacher does not get passed', () => {
    const wrapper = shallow(
      <InviteCoteacherModal
        close={() => {}}
        onSuccess={() => {}}
        classroom={classroomWithStudents}
        classrooms={classroomProps}
      />
    );

    it('should render InviteCoteacherModal', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render an input field', () => {
      expect(wrapper.find(Input).exists()).toBe(true)
    })

    it('should render a datatable', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })
  })

})
