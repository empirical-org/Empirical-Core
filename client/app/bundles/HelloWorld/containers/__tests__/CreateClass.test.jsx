import React from 'react';
import { shallow } from 'enzyme';

import CreateClass from '../CreateClass.jsx';

import $ from 'jquery'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import ButtonLoadingIndicator from '../../components/shared/button_loading_indicator.jsx'
import GoogleClassroomModal from '../../components/dashboard/google_classroom_modal'

jest.mock('jquery', () => {
  return {
    ajax: jest.fn(),
    post: jest.fn().mockReturnValue({
      success: jest.fn().mockReturnValue({
        error: jest.fn()
      })
    })
  }
});

describe('CreateClass container', () => {

  it('should display a ButtonLoadingIndicator component if loading', () => {
    const wrapper = shallow(<CreateClass />);
    wrapper.setState({loading: true});
    expect(wrapper.find(ButtonLoadingIndicator).exists()).toBe(true);
  });

  it('should render a blank create class form if no class exists in state', () => {
    expect(shallow(<CreateClass />)).toMatchSnapshot();
  })

  describe('with class in state', () => {
    const wrapper = shallow(
      <CreateClass
        user={{foo: 'bar'}}
      />
    );
    wrapper.setState({
      classroom: {
        name: 'English 101',
        grade: 7,
        code: 'smelly-fish'
      },
      loading: false
    });

    describe('classroom name text input', () => {
      it('should render with classroom name as value', () => {
        expect(wrapper.find('#class-name').props().value).toBe('English 101');
      });

      it('onChange should update classroom name', () => {
        wrapper.find('#class-name').simulate('change', {currentTarget: {value: 'English 404'}});
        expect(wrapper.state().classroom.name).toBe('English 404');
      });
    });

    describe('DropdownButton component', () => {
      it('should have correctly formatted title prop', () => {
        expect(wrapper.find(DropdownButton).props().title).toBe('7th Grade');
        wrapper.setState({ classroom: { grade: 1 }});
        expect(wrapper.find(DropdownButton).props().title).toBe('1st Grade');
        wrapper.setState({ classroom: { grade: 2 }});
        expect(wrapper.find(DropdownButton).props().title).toBe('2nd Grade');
        wrapper.setState({ classroom: { grade: 3 }});
        expect(wrapper.find(DropdownButton).props().title).toBe('3rd Grade');
        wrapper.setState({ classroom: { grade: 'University' }});
        expect(wrapper.find(DropdownButton).props().title).toBe('University');
        wrapper.setState({ classroom: { grade: 'Other' }});
        expect(wrapper.find(DropdownButton).props().title).toBe('Other');
        wrapper.setState({
          classroom: {
            name: 'English 101',
            grade: 7,
            code: 'smelly-fish'
          }
        });
      });

      it('should render MenuItems for grades K-12, University, and Other', () => {
        expect(wrapper.find(MenuItem)).toHaveLength(14);
      });

      it('onSelect event should change grade in state', () => {
        wrapper.find(DropdownButton).simulate('select', 6);
        expect(wrapper.state().classroom.grade).toBe(6);
      });
    });

    it('classroom code should render', () => {
      expect(wrapper.find('#classroom_code').props().value).toBe('smelly-fish');
    });

    it('regeneration button onClick should retrieve new code and call setClassCode on success', () => {
      wrapper.find('#regenerate-class-code').simulate('click');
      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.mock.calls[0][0].url).toBe('/teachers/classrooms/regenerate_code');
      expect($.ajax.mock.calls[0][0].success).toBe(wrapper.instance().setClassCode);
    });

    describe('create a class button onClick', () => {
      it('should call submitClassroom if there is a name and grade', () => {
        wrapper.instance().submitClassroom = jest.fn();
        wrapper.find('.submit-button').simulate('click');
        expect(wrapper.instance().submitClassroom).toHaveBeenCalled;
      });

      it('should set errors if name is missing', () => {
        const wrapperWithoutName = shallow(
          <CreateClass />
        );
        wrapperWithoutName.setState({
          classroom: {
            grade: 7,
            code: 'smelly-fish'
          },
          loading: false
        });
        wrapperWithoutName.find('.submit-button').simulate('click');
        expect(wrapperWithoutName.state().errors).toBe('You must choose your classroom\'s name before continuing.');
      });

      it('should set errors if grade is missing', () => {
        const wrapperWithoutGrade = shallow(
          <CreateClass />
        );
        wrapperWithoutGrade.setState({
          classroom: {
            name: 'English 101',
            code: 'smelly-fish'
          },
          loading: false
        });
        wrapperWithoutGrade.find('.submit-button').simulate('click');
        expect(wrapperWithoutGrade.state().errors).toBe('You must choose your classroom\'s grade before continuing.');
      });
    });

    it('errors should render', () => {
      expect(wrapper.find('.errors').text()).toBe('');
      wrapper.setState({errors: 'Everything is broken!'});
      expect(wrapper.find('.errors').text()).toBe('Everything is broken!');
    })

    describe('import from Google button onClick', () => {
      const wrapperSignedUpWithGoogle = shallow(
        <CreateClass
          user={{signed_up_with_google: true}}
        />
      );
      wrapperSignedUpWithGoogle.instance().syncClassrooms = jest.fn();
      const wrapperNotSignedUpWithGoogle = shallow(
        <CreateClass
          user={{signed_up_with_google: false}}
        />
      );
      [wrapperSignedUpWithGoogle, wrapperNotSignedUpWithGoogle].forEach((w) => {
        w.setState({
          classroom: {
            name: 'English 101',
            grade: 7,
            code: 'smelly-fish'
          },
          loading: false
        });
        w.find('#new-google-classroom button').simulate('click');
      });

      it('should call syncClassrooms if user is signed up with google', () => {
        expect(wrapperSignedUpWithGoogle.instance().syncClassrooms).toHaveBeenCalled();
      });

      it('should show modal if user is not signed up with google', () => {
        expect(wrapperNotSignedUpWithGoogle.state().showModal).toBe(true);
      });
    });

    describe('GoogleClassroomModal component', () => {
      it('should have syncClassrooms prop', () => {
        //TODO: determine how best to test syncClassrooms actually redirects w/ window.location
        expect(wrapper.find(GoogleClassroomModal).props().syncClassrooms).toBe(wrapper.instance().syncClassrooms);
      });

      it('should have user prop', () => {
        expect(wrapper.find(GoogleClassroomModal).props().user.foo).toBe('bar');
      });

      it('should have show prop based on state.showModal', () => {
        wrapper.setState({showModal: false});
        expect(wrapper.find(GoogleClassroomModal).props().show).toBe(false);
        wrapper.setState({showModal: true});
        expect(wrapper.find(GoogleClassroomModal).props().show).toBe(true);

      });

      it('should have hideModal prop that hides modal', () => {
        wrapper.setState({showModal: true});
        wrapper.find(GoogleClassroomModal).props().hideModal();
        expect(wrapper.state().showModal).toBe(false);
      });
    });

    describe('submitClassroom function', () => {
      //TODO: add tests for contents of success and error functions?
      const wrapper = shallow(<CreateClass />);
      it('should send post request with classroom data', () => {
        wrapper.setState({
          classroom: {
            name: 'English 202',
            grade: 9,
            code: 'cute-puppy'
          }
        });
        wrapper.instance().submitClassroom();
        expect($.post).toHaveBeenCalled();
        expect($.post.mock.calls[0][0]).toBe('/teachers/classrooms/');
        expect($.post.mock.calls[0][1].classroom.name).toBe('English 202');
        expect($.post.mock.calls[0][1].classroom.grade).toBe(9);
        expect($.post.mock.calls[0][1].classroom.code).toBe('cute-puppy');
      });
    });

  });

});
