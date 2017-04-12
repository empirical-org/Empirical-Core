import React from 'react';
import { shallow } from 'enzyme';

import CreateClass from '../CreateClass.jsx';

import $ from 'jquery'
import LoadingSpinner from '../../components/shared/loading_indicator.jsx'

jest.mock('jquery', () => {
  return {
    ajax: jest.fn()
  }
});

describe('CreateClass container', () => {

  it('should display a LoadingSpinner component if loading', () => {
    const wrapper = shallow(<CreateClass />);
    wrapper.setState({loading: true});
    expect(wrapper.find(LoadingSpinner).exists()).toBe(true);
  });

  it('should render a blank create class form if no class exists in state', () => {
    expect(shallow(<CreateClass />)).toMatchSnapshot();
  })

  describe('with class in state', () => {
    const wrapper = shallow(
      <CreateClass />
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
      it.skip('should have correctly formatted title prop', () => {

      });

      it.skip('should have grades as a child prop', () => {

      });

      it.skip('should handle onSelect event', () => {

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
      it.skip('should have syncClassrooms prop', () => {

      });

      it.skip('should have user prop', () => {

      });

      it.skip('should have show prop', () => {

      });

      it.skip('should have hideModal prop', () => {

      });
    });

    describe('submitClassroom function', () => {
      // hoo boy, this is gonna be a rough one
    });

  });

});
