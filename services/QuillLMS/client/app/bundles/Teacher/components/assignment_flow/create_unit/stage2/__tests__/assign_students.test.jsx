import React from 'react'
import { shallow } from 'enzyme'

import { classroomProps, user } from './test_data/test_data'

import AssignStudents, {
  createAClassForm,
  importGoogleClassroomsModal,
  linkGoogleAccountModal,
  googleClassroomsEmptyModal
} from '../assign_students'
import ClassroomCard from '../classroom_card.tsx'
import CreateAClassInlineForm from '../create_a_class_inline_form.tsx'
import ImportGoogleClassroomsModal from '../../../../classrooms/import_google_classrooms_modal.tsx'
import LinkGoogleAccountModal from '../../../../classrooms/link_google_account_modal.tsx'
import GoogleClassroomsEmptyModal from '../../../../classrooms/google_classrooms_empty_modal.tsx'


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

  describe('if this.state.showFormOrModal = createAClassForm', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )
    wrapper.setState({ showFormOrModal: createAClassForm })

    it('should render a createAClassInlineForm component', () => {
      expect(wrapper.find(CreateAClassInlineForm).exists()).toBe(true)
    })
  })

  describe('if this.state.showFormOrModal = importGoogleClassroomsModal', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )
    wrapper.setState({ showFormOrModal: importGoogleClassroomsModal })

    it('should render a importGoogleClassroomsModal component', () => {
      expect(wrapper.find(ImportGoogleClassroomsModal).exists()).toBe(true)
    })
  })

  describe('if this.state.showFormOrModal = linkGoogleAccountModal', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )
    wrapper.setState({ showFormOrModal: linkGoogleAccountModal })

    it('should render a linkGoogleAccountModal component', () => {
      expect(wrapper.find(LinkGoogleAccountModal).exists()).toBe(true)
    })
  })

  describe('if this.state.showFormOrModal = googleClassroomsEmptyModal', () => {
    const wrapper = shallow(
      <AssignStudents
        classrooms={classroomProps}
        fetchClassrooms={() => {}}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
        user={user}
      />
    )
    wrapper.setState({ showFormOrModal: googleClassroomsEmptyModal })

    it('should render a googleClassroomsEmptyModal component', () => {
      expect(wrapper.find(GoogleClassroomsEmptyModal).exists()).toBe(true)
    })
  })

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
