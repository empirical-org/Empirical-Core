import * as React from 'react';
import { mount } from 'enzyme';

import AssignADiagnostic from '../create_unit/assign_a_diagnostic';
import AssignmentCard from '../create_unit/assignment_card';

const assignedPreTests = [{"id":1663,"post_test_id":1664,"assigned_classroom_ids":[1]},{"id":1668,"post_test_id":1669,"assigned_classroom_ids":[]},{"id":1678,"post_test_id":1680,"assigned_classroom_ids":[]}]

describe('AssignADiagnostic component', () => {
  const component = mount(<AssignADiagnostic assignedPreTests={assignedPreTests} />);

  it('should render AssignADiagnostic', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render 16 AssignmentCard components', ()=> {
    expect(component.find(AssignmentCard)).toHaveLength(16);
  })
});
