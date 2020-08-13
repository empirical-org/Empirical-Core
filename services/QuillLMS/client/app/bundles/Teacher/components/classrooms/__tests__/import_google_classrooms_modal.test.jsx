import React from 'react';
import { mount } from 'enzyme';

import ImportGoogleClassroomsModal from '../import_google_classrooms_modal'
import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { googleClassrooms, userProps } from './test_data/test_data'

describe('ImportGoogleClassroomsModal component', () => {

  describe('initial load', () => {
    const wrapper = mount(
      <ImportGoogleClassroomsModal
        classrooms={googleClassrooms}
        close={() => {}}
        onSuccess={() => {}}
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
        close={() => {}}
        onSuccess={() => {}}
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
