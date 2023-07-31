import { shallow } from 'enzyme';
import React from 'react';

import NoClassroomsToImportModal from '../no_classrooms_to_import_modal';

describe('NoClassroomsToImportModal component', () => {
  const close = () => {}

  const wrapper = shallow(
    <NoClassroomsToImportModal
      close={close}
      provider='Clever'
    />
  );

  it('should render NoClassroomsToImportModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
