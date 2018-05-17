import React from 'react';
import { shallow } from 'enzyme';

import AddStudent from '../AddStudent.jsx';

import $ from 'jquery'
import ItemDropdown from '../../components/general_components/dropdown_selectors/item_dropdown.jsx'
import ClassroomsStudentsTable from '../../components/general_components/classrooms_students_table.jsx'
import LoadingSpinner from '../../components/shared/loading_indicator.jsx'
import StudentCreatesAccountSection from '../../components/invite_users/add_students/StudentCreatesAccountSection.jsx'
import TeacherCreatesAccountSection from '../../components/invite_users/add_students/TeacherCreatesAccountSection.jsx'
import GoogleClassroomCreatesAccountSection from '../../components/invite_users/add_students/GoogleClassroomCreatesAccountSection.jsx'

jest.mock('jquery', () => {
  return {
    post: jest.fn().mockReturnValue({
      success: jest.fn().mockReturnValue({
        fail: jest.fn()
      })
    })
  };
});

describe('AddStudent container', () => {
  let classroom, wrapper, wrapperUserSignedUpWithGoogle;
  beforeEach(() => {
    classroom = { name: 'English 200', code: 'E200', id: 200 };
    wrapper = shallow(
      <AddStudent
        classrooms={[ classroom, { name: 'English 404', code: 'E404', id: 404 } ]}
        user={{name: 'Jerry Seinfeld'}}
      />
    );
    wrapperUserSignedUpWithGoogle = shallow(
      <AddStudent
        classrooms={[ classroom, { name: 'English 404', code: 'E404', id: 404 } ]}
        user={{name: 'Jerry Seinfeld', signed_up_with_google: true}}
      />
    );
  });

  describe('ItemDropdown component', () => {
    it('should render', () => {
      expect(wrapper.find(ItemDropdown).exists()).toBe(true);
    });

    it('should pass classrooms to classrooms prop', () => {
      expect(wrapper.find(ItemDropdown).props().items).toHaveLength(2);
      expect(wrapper.find(ItemDropdown).props().items[0].name).toBe('English 200');
      expect(wrapper.find(ItemDropdown).props().items[1].name).toBe('English 404');
    });

    it('should have a working updateClassroom callback', () => {
      wrapper.instance().retrieveStudents = jest.fn();
      wrapper.find(ItemDropdown).props().callback(classroom);
      expect(wrapper.state().selectedClassroom).toBe(classroom);
      expect(wrapper.state().loading).toBe(true);
      expect(wrapper.instance().retrieveStudents.mock.calls).toHaveLength(1);
      expect(wrapper.instance().retrieveStudents.mock.calls[0][0]).toBe(200);
    });
  });

  describe('StudentCreatesAccountSection component', () => {
    it('should render', () => {
      expect(wrapper.find(StudentCreatesAccountSection).exists()).toBe(true);
    });

    it('should have the correct class code', () => {
      wrapper.setState({selectedClassroom: {code: 'bosco'}});
      expect(wrapper.find(StudentCreatesAccountSection).props().classCode).toBe('bosco');
    });
  });

  describe('GoogleClassroomCreatesAccountSection component', () => {
    it('should render', () => {
      expect(wrapper.find(GoogleClassroomCreatesAccountSection).exists()).toBe(true);
    });

    it('should have the correct props', () => {
      wrapper.instance().syncClassrooms = jest.fn();
      wrapper.instance().hideModal = jest.fn();
      wrapper.instance().syncOrModal = jest.fn();
      wrapper.setState({showModal: 'arbitrary'});
      const component = wrapper.find(GoogleClassroomCreatesAccountSection);
      component.props().syncClassrooms();
      component.props().hideModal();
      component.props().syncOrModal();
      expect(wrapper.instance().syncClassrooms.mock.calls).toHaveLength(1);
      expect(wrapper.instance().hideModal.mock.calls).toHaveLength(1);
      expect(wrapper.instance().syncOrModal.mock.calls).toHaveLength(1);
      expect(wrapper.state().showModal).toBe('arbitrary');
      expect(component.props().user.name).toBe('Jerry Seinfeld');
    });

    describe('functions passed as props', () => {
      it('should include a working hideModal function', () => {
        wrapper.setState({showModal: true});
        wrapper.instance().hideModal();
        expect(wrapper.state().showModal).toBe(false);
      });

      it.skip('should include a syncClassrooms function that redirects to google sync', () => {
        // I'm not sure how best to implement this, but I need to move on for now.
        // TODO: write this test.
      });

      it('should include a syncOrModal function that shows modal if user is not signed up with google or syncs classrooms if they are', () => {
        wrapper.setState({showModal: false});
        wrapper.instance().syncClassrooms = jest.fn();
        wrapper.instance().syncOrModal();
        expect(wrapper.instance().syncClassrooms.mock.calls).toHaveLength(0);
        expect(wrapper.state().showModal).toBe(true);
        wrapperUserSignedUpWithGoogle.setState({showModal: false});
        wrapperUserSignedUpWithGoogle.instance().syncClassrooms = jest.fn();
        wrapperUserSignedUpWithGoogle.instance().syncOrModal();
        expect(wrapperUserSignedUpWithGoogle.instance().syncClassrooms.mock.calls).toHaveLength(1);
        expect(wrapperUserSignedUpWithGoogle.state().showModal).toBe(false);
      });
    });
  });

  describe('TeacherCreatesAccountSection component', () => {
    it('should render', () => {
      expect(wrapper.find(TeacherCreatesAccountSection).exists()).toBe(true);
    });

    it('should have the correct props', () => {
      wrapper.instance().nameChange = jest.fn();
      wrapper.instance().submitStudent = jest.fn();
      wrapper.setState({
        selectedClassroom: { id: 7 },
        firstName: 'George',
        lastName: 'Costanza',
        disabled: false,
        errors: ['Something is wrong!', 'Oh no!']
      });
      const component = wrapper.find(TeacherCreatesAccountSection);
      component.props().nameChange();
      component.props().submitStudent();
      expect(component.props().classID).toBe(7);
      expect(component.props().firstName).toBe('George');
      expect(component.props().lastName).toBe('Costanza');
      expect(component.props().disabled).toBe(false);
      expect(component.props().errors).toHaveLength(2);
      expect(wrapper.instance().nameChange.mock.calls).toHaveLength(1);
      expect(wrapper.instance().submitStudent.mock.calls).toHaveLength(1);
    });

    it('nameChange prop should update state with key and value when called', () => {
      wrapper.instance().nameChange({target: {value: 'bosco'}}, 'password');
      expect(wrapper.state().password).toBe('bosco');
    });

    describe('submitStudent function', () => {
      it('should post the appropriate data', () => {
        wrapper.setState({ firstName: 'Cosmo', lastName: 'Kramer', selectedClassroom: { id: 7 }});
        wrapper.instance().submitStudent(null);
        expect($.post.mock.calls).toHaveLength(1);
        expect($.post.mock.calls[0][0]).toBe('/teachers/classrooms/7/students');
        expect($.post.mock.calls[0][1].user.first_name).toBe('Cosmo');
        expect($.post.mock.calls[0][1].user.last_name).toBe('Kramer');
      });
    });
  });

  it('should render a LoadingSpinner component if loading', () => {
    wrapper.setState({loading: true});
    expect(wrapper.find(LoadingSpinner).exists()).toBe(true);
  });

  it('should render a ClassroomsStudentsTable with students if there are students', () => {
    expect(wrapper.find(ClassroomsStudentsTable).exists()).toBe(false);
    wrapper.setState({ students: ['Kramer', 'George'], loading: false });
    expect(wrapper.find(ClassroomsStudentsTable).exists()).toBe(true);
    expect(wrapper.find(ClassroomsStudentsTable).props().students).toHaveLength(2);
  });

  it('should retrieve students on componentDidMount', () => {
    wrapper.instance().retrieveStudents = jest.fn();
    wrapper.setState({selectedClassroom: {id: 7}});
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().retrieveStudents.mock.calls).toHaveLength(1);
    expect(wrapper.instance().retrieveStudents.mock.calls[0][0]).toBe(7);
  });

});
