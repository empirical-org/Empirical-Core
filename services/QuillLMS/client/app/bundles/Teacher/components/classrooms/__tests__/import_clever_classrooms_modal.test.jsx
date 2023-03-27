import { mount } from 'enzyme';
import React from 'react';

import { cleverClassroomsData, userProps } from './test_data/test_data';

import { DataTable } from '../../../../Shared/index';

describe('importCleverClassroomsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  describe('initial load', () => {
    const wrapper = mount(
      <importCleverClassroomsModal
        classrooms={cleverClassroomsData}
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

  describe('#handleClickimportClasses', () => {
    const wrapper = mount(
      <importCleverClassroomsModal
        classrooms={cleverClassroomsData}
        close={close}
        onSuccess={onSuccess}
        user={userProps}
      />
    );

    const checkedCleverClassrooms = [...cleverClassroomsData]
    checkedCleverClassrooms[0].checked = true
    wrapper.setState({ classrooms: checkedCleverClassrooms })

    it('should set a classroom that is checked', () => {
      wrapper.instance().handleClickimportClasses()
      expect(wrapper).toMatchSnapshot();
    })
  })

});
