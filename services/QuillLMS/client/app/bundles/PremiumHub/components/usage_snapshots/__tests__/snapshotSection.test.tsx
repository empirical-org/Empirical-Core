import { mount } from 'enzyme';
import * as React from 'react';

import { timeframes, grades, schools, teachers, classrooms, } from './data'

import { snapshotSections, } from '../shared'
import SnapshotSection from '../snapshotSection';

describe('SnapshotSection component', () => {
  const sharedProps = {
    searchCount: 1,
    selectedGrades: grades.map(g => g.value),
    selectedSchoolIds: schools.map(s => s.id),
    selectedTeacherIds: teachers.map(s => s.id),
    selectedClassroomIds: classrooms.map(s => s.id),
    selectedTimeframe: timeframes[0].value,
    adminId: 1,
    customTimeframeStart: null,
    customTimeframeEnd: null,
  }

  snapshotSections.forEach(section => {
    describe (`when the section is ${section.name}`, () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotSection
          {...sharedProps}
          className={section.className}
          itemGroupings={section.itemGroupings}
          key={section.name}
          name={section.name}
        />);

        expect(component).toMatchSnapshot();
      });
    })
  })

});
