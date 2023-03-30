import * as React from 'react';
import { mount } from 'enzyme';

import RequestAdminAccessForm from '../request_admin_access_form';

describe('RequestAdminAccessForm component', () => {

  it('should render', () => {
    const component = mount(<RequestAdminAccessForm admins={[{ name: 'Joy Harjo', email: 'joyharjo@quill.org', id: 1 }]} schoolName="School Name" />);
    expect(component).toMatchSnapshot();
  });

});
