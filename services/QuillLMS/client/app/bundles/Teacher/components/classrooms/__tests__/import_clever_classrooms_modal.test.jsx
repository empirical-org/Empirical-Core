import React from 'react';
import { mount } from 'enzyme';

import { cleverClassrooms, userProps } from './test_data/test_data'

import ImportCleverClassroomsModal from '../import_clever_classrooms_modal'
import { DataTable } from '../../../../Shared/index'

describe('ImportCleverClassroomsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  describe('initial load', () => {
    const wrapper = mount(
      <ImportCleverClassroomsModal
        classrooms={cleverClassrooms}
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
      <ImportCleverClassroomsModal
        classrooms={cleverClassrooms}
        close={close}
        onSuccess={onSuccess}
        user={userProps}
      />
    );

    const checkedCleverClassrooms = [...cleverClassrooms]
    checkedCleverClassrooms[0].checked = true
    wrapper.setState({ classrooms: checkedCleverClassrooms })

    it('should set a classroom that is checked but has no grade to have an error', () => {
      wrapper.instance().handleClickImportClasses()
      expect(wrapper.state().classrooms[0].error).toBe("Select a grade for your class")
      expect(wrapper).toMatchSnapshot();
    })
  })

});
