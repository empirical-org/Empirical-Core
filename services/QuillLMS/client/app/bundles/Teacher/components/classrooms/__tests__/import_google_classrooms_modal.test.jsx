import React from 'react';
import { shallow } from 'enzyme';

import ImportGoogleClassroomsModal from '../import_google_classrooms_modal'
import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { googleClassrooms, userProps } from './test_data/test_data'

describe('ImportGoogleClassroomsModal component', () => {

  const wrapper = shallow(
    <ImportGoogleClassroomsModal
      close={() => {}}
      onSuccess={() => {}}
      classrooms={googleClassrooms}
      user={userProps}
    />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a data table', () => {
    expect(wrapper.find(DataTable).exists()).toBe(true)
  })

});
