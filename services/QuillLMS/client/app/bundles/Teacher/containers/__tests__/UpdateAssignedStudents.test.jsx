import {
  mount,
  shallow
} from 'enzyme';
import _ from 'lodash';
import * as React from 'react';

import UpdateAssignedStudents from '../UpdateAssignedStudents';
import { classrooms, } from './test_data';

const props = {
  match: { params: { unitId: 912 }, },
  unassignWarningHidden: false,
  passedLoading: false,
  passedOriginalClassrooms: classrooms,
  passedClassroomsForComparison: classrooms,
  passedAssignmentData: [
    {id: 173, student_ids: [1032, 1036], assign_on_join: false}
  ],
  passedUnitName: "Quill Activity Pack"
}

describe('UpdateAssignedStudents', () => {
  it('will render ', () => {
    const component = mount(<UpdateAssignedStudents {...props} />)

    expect(component).toMatchSnapshot()
  })
})
