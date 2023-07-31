import { shallow } from 'enzyme'
import React from 'react'

import { classroomProps, googleUser, user } from './test_data/test_data'

import LinkProviderAccountModal from '../../../../classrooms/link_provider_account_modal'
import AssignStudents from '../assign_students'
import ClassroomCard from '../classroom_card.tsx'
import CreateAClassInlineForm from '../create_a_class_inline_form.tsx'


describe('Assign students component', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('user clicks create a class button', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )

    it('should render a createAClassInlineForm component', () => {
      wrapper.find('.create-a-class-button').simulate('click')
      expect(wrapper.find(CreateAClassInlineForm).exists()).toBe(true)
    })
  })

  // describe('user clicks import from google', () => {
  //   const wrapper = shallow(
  //     <AssignStudents
  //       classrooms={classroomProps}
  //       fetchClassrooms={() => {}}
  //       toggleClassroomSelection={() => {}}
  //       toggleStudentSelection={() => {}}
  //       user={googleUser}
  //     />
  //   )

  //   it('should render a importProviderClassroomsModal component', () => {
  //     expect(wrapper.find(ImportProviderClassroomsModal).exists()).toBe(true)
  //   })
  // })

  describe('if this.state.showFormOrModal = linkProviderAccountModal', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )

    wrapper.find('button').filterWhere(node => node.text() === 'Import from Canvas').simulate('click');

    it('should render a linkProviderAccountModal component', () => {
      expect(wrapper.find(LinkProviderAccountModal).exists()).toBe(true)
    })
  })

  // describe('if this.state.showFormOrModal = noClassroomsToImportModal', () => {
  //   const wrapper = shallow(
  //     <AssignStudents
  //       classrooms={classroomProps}
  //       fetchClassrooms={() => {}}
  //       toggleClassroomSelection={() => {}}
  //       toggleStudentSelection={() => {}}
  //       user={user}
  //     />
  //   )


  //   wrapper.setState({ showFormOrModal: noClassroomsToImportModal })

  //   it('should render a noClassroomsToImportModal component', () => {
  //     expect(wrapper.find(NoClassroomsToImportModal).exists()).toBe(true)
  //   })
  // })

  describe('if there are classrooms', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )

    it('should render a classroom card for each classroom', () => {
      expect(wrapper.find(ClassroomCard).length).toBe(classroomProps.length)
    })

  })

  describe('if there are no classrooms', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={[]}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )

    it('should render an empty state', () => {
      expect(wrapper.find('.no-active-classes').exists()).toBe(true)
    })
  })

})
