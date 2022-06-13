import React from 'react';
import { mount } from 'enzyme';

import { googleClassrooms, userProps } from './test_data/test_data'

import ImportGoogleClassroomsModal from '../import_google_classrooms_modal'
import { DataTable } from '../../../../Shared/index'

describe('ImportGoogleClassroomsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  describe('initial load', () => {
    const wrapper = mount(
      <ImportGoogleClassroomsModal
        classrooms={googleClassrooms}
        close={close}
        onSuccess={onSuccess}
        user={userProps}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a data table', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })
  })

  describe('#handleClickImportClasses', () => {
    const wrapper = mount(
      <ImportGoogleClassroomsModal
        classrooms={googleClassrooms}
        close={close}
        onSuccess={onSuccess}
        user={userProps}
      />
    );

    const checkedGoogleClassrooms = [...googleClassrooms]
    checkedGoogleClassrooms[0].checked = true
    wrapper.setState({ classrooms: checkedGoogleClassrooms, })

    it('should set a classroom that is checked but has no grade to have an error', () => {
      wrapper.instance().handleClickImportClasses()
      expect(wrapper.state().classrooms[0].error).toBe("Select a grade for your class")
      expect(wrapper).toMatchSnapshot();
    })
  })

});
