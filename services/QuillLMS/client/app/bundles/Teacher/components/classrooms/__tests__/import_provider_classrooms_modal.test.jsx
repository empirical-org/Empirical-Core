import React from 'react';
import { shallow } from 'enzyme';

import { googleClassrooms, googleUserProps } from './test_data/test_data'

import ImportProviderClassroomsModal from '../import_provider_classrooms_modal'
import { DataTable } from '../../../../Shared/index'

describe('ImportProviderClassroomsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  describe('initial load', () => {
    const wrapper = shallow(
      <ImportProviderClassroomsModal
        classrooms={googleClassrooms}
        close={close}
        onSuccess={onSuccess}
        provider='Google'
        user={googleUserProps}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a data table', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })
  })

  // describe('#handleClickImportClasses', () => {
  //   const wrapper = shallow(
  //     <ImportProviderClassroomsModal
  //       classrooms={googleClassrooms}
  //       close={close}
  //       onSuccess={onSuccess}
  //       provider='Google'
  //       user={googleUserProps}
  //     />
  //   );

  //   it('should set a classroom that is checked but has no grade to have an error', () => {
  //     wrapper.find('.quill-checkbox').at(0).simulate('click');
  //     wrapper.find('button').filterWhere(n => n.text() === 'Import classes').simulate('click');

  //     const errorSpan = wrapper.find('span.error-text').at(0);
  //     expect(errorSpan.exists()).toBe(true);
  //     expect(errorSpan.text()).toBe('Select a grade for your class');
  //     expect(wrapper).toMatchSnapshot();
  //   })
  // })

});
