import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents, classroomProps } from './test_data/test_data'

import InviteCoteacherModal from '../invite_coteachers_modal'
import { Input, DataTable, } from '../../../../Shared/index'


describe('InviteCoteacherModal component', () => {

  describe('if a coteacher gets passed', () => {
    const wrapper = shallow(
      <InviteCoteacherModal
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        close={() => {}}
        coteacher={classroomWithStudents.teachers[1]}
        onSuccess={() => {}}
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
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        close={() => {}}
        onSuccess={() => {}}
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
