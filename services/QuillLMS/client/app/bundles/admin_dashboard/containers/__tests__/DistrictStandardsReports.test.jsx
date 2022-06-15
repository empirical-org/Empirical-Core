import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';

import AdminDashboardRouter from '../AdminDashboardRouter.jsx';
import DistrictStandardsReports from '../DistrictStandardsReports.jsx';

describe('DistrictStandardsReports', () => {
  it('renders report for all students', () => {
    const classroom = {
      standard_level_name: '1st Grade CCSS',
      name: '1.1b Use Common, Proper, and Posessive Nouns',
      total_student_count: 60,
      total_activity_count: 2,
      proficient_count: 29,
    };
    const state = {
      district_standards_reports: {
        loading: false,
        errors: false,
        selectedClassroom: 'All Classrooms',
        selectedSchool: 'All Schools',
        selectedTeacher: 'All Teachers',
        standardsReportsData: [classroom],
      },
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictStandardsReports store={store} />);

    expect(wrapper.find('DistrictStandardsReports').prop('filteredStandardsReportsData')).toEqual([classroom]);
  });

  it('formats csv data', () => {
    const classroom = {
      standard_level_name: "Mrs. Bonker's 2nd Grade",
      name: '1.1b How to tell a cactus from a cow',
      total_student_count: 60,
      total_activity_count: 2,
      proficient_count: 29,
    };
    const state = {
      district_standards_reports: {
        loading: false,
        errors: false,
        selectedClassroom: 'All Classrooms',
        selectedSchool: 'All Schools',
        selectedTeacher: 'All Teachers',
        standardsReportsData: [classroom],
      },
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictStandardsReports store={store} />);

    expect(wrapper.find('DistrictStandardsReports').prop('csvData')).toEqual([
      [
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient',
        'Activities',
        'Time Spent'
      ],
      [
        "Mrs. Bonker's 2nd Grade",
        '1.1b How to tell a cactus from a cow',
        60,
        29,
        2,
        'N/A'
      ]
    ]);
  });

  /*
  it('invalid path should redirect to 404', () => {
    console.log(MemoryRouter);
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <AdminDashboardRouter/>
      </MemoryRouter>
    );
    expect(1+1).toEqual(2);
    //expect(wrapper.find(DistrictStandardsReportsProgressReport)).toHaveLength(0);
  });
  */
});
