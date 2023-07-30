import React from 'react';
import { mount } from 'enzyme';

import { googleClassrooms } from './test_data/test_data'

import ImportProviderClassroomsModal from '../import_provider_classrooms_modal'
import { DataTable } from '../../../../Shared/index'

describe('ImportProviderClassroomsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  describe('initial load', () => {
    const wrapper = mount(
      <ImportProviderClassroomsModal
        classrooms={googleClassrooms}
        close={close}
        onSuccess={onSuccess}
        provider='Google'
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
      <ImportProviderClassroomsModal
        classrooms={googleClassrooms}
        close={close}
        onSuccess={onSuccess}
        provider='Google'
      />
    );

    it('should set a classroom that is checked but has no grade to have an error', () => {
      wrapper.find('.quill-checkbox').at(0).simulate('click');
      wrapper.find('button').filterWhere(n => n.text() === 'Import classes').simulate('click');

      const errorSpan = wrapper.find('span.error-text').at(0);
      expect(errorSpan.exists()).toBe(true);
      expect(errorSpan.text()).toBe('Select a grade for your class');
      expect(wrapper).toMatchSnapshot();
    })
  })

});
