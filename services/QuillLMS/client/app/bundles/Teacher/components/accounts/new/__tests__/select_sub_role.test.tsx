import { mount } from 'enzyme';
import * as React from 'react';

import SelectSubRole from '../select_sub_role';

const SUB_ROLES = [
  "Instructional coach",
  "Department head",
  "School administrator",
  "District administrator",
  "Tech coordinator",
  "Librarian/media specialist",
  "Billing contact"
]

describe('SelectSubRole component', () => {

  it('should render', () => {
    const component = mount(<SelectSubRole subRoles={SUB_ROLES} />);
    expect(component).toMatchSnapshot();
  });
});
