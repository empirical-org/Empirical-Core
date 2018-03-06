import React from 'react';
import { shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';

import DistrictConceptReports from 'bundles/admin_dashboard/containers/DistrictConceptReports.jsx';

describe('DistrictConceptReports', () => {

  it('renders report for all students', () => {
    const classroom = {
      classroom_name: 'Professor Trelawney - Divination',
      schools_name: 'Hogwarts',
      students_name: 'Parvati Patil',
      teachers_name: 'Sybill Trelawney',
    };
    const state = {
      loading: false,
      errors: false,
      selectedClassroom: 'All Classrooms',
      selectedSchool: 'All Schools',
      selectedTeacher: 'All Teachers',
      classroomsData: [classroom],
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictConceptReports store={store} />);

    expect(wrapper.prop('filteredClassroomsData')).toEqual([classroom]);
  });

  it('formats csv data', () => {
    const classroom = {
      classroom_name: 'Mrs. Krabapple - 4th Grade',
      schools_name: 'Springfield Elementary',
      students_name: 'Bart Simpson',
      teachers_name: 'Mrs. Krabapple',
      correct: '12',
      incorrect: '20',
      percentage: '37',
    };
    const state = {
      loading: false,
      errors: false,
      selectedClassroom: 'All Classrooms',
      selectedSchool: 'All Schools',
      selectedTeacher: 'All Teachers',
      classroomsData: [classroom],
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictConceptReports store={store} />);

    expect(wrapper.prop('csvData')).toEqual([
      [
        'Student',
        'Teacher',
        'Classroom',
        'School',
        'Correct',
        'Incorrect',
        'Success Rate'
      ],
      [
        'Bart Simpson',
        'Mrs. Krabapple',
        'Springfield Elementary',
        '12',
        '20',
        '37%',
      ]
    ]);
  });


  it('filters the report', () => {
    const classrooms = [
      {
        classroom_name: 'Poetry 101',
        schools_name: 'Bel-Air Academy',
        students_name: 'Carlton Banks',
        teachers_name: 'Ned Fellows',
      }, {
        classroom_name: "Mr. Garrison's 4th Grade",
        schools_name: 'South Park Elementary',
        students_name: 'Eric Cartman',
        teachers_name: 'Mr. Garrison',
      }, {
        classroom_name: "Mrs. Crabtree's Morning Bus",
        schools_name: 'South Park Elementary',
        students_name: 'Stan Marsh',
        teachers_name: 'Mrs. Crabtree',
      }, {
        classroom_name: "Mrs. Crabtree's Afternoon Bus",
        schools_name: 'South Park Elementary',
        students_name: 'Butters',
        teachers_name: 'Mrs. Crabtree',
      }
    ];
    const state = {
      loading: false,
      errors: false,
      selectedClassroom: "Mrs. Crabtree's Afternoon Bus",
      selectedSchool: 'South Park Elementary',
      selectedTeacher: 'Mrs. Crabtree',
      classroomsData: classrooms,
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictActivityScores store={store} />);

    expect(wrapper.prop('filteredClassroomsData')).toEqual([{
      classroom_name: "Mrs. Crabtree's Afternoon Bus",
      schools_name: 'South Park Elementary',
      students_name: 'Butters',
      teachers_name: 'Mrs. Crabtree',
    }]);
  });

  it('populates the dropdown options', () => {
    const classrooms = [
      {
        classroom_name: 'Poetry 101',
        schools_name: 'Bel-Air Academy',
        students_name: 'Carlton Banks',
        teachers_name: 'Ned Fellows',
      }, {
        classroom_name: "Mr. Garrison's 4th Grade",
        schools_name: 'South Park Elementary',
        students_name: 'Eric Cartman',
        teachers_name: 'Mr. Garrison',
      }, {
        classroom_name: "Mrs. Crabtree's Morning Bus",
        schools_name: 'South Park Elementary',
        students_name: 'Stan Marsh',
        teachers_name: 'Mrs. Crabtree',
      }, {
        classroom_name: "Mrs. Crabtree's Afternoon Bus",
        schools_name: 'South Park Elementary',
        students_name: 'Butters',
        teachers_name: 'Mrs. Crabtree',
      }
    ];
    const state = {
      loading: false,
      errors: false,
      selectedClassroom: "Mrs. Crabtree's Afternoon Bus",
      selectedSchool: 'South Park Elementary',
      selectedTeacher: 'Mrs. Crabtree',
      classroomsData: classrooms,
    };
    const store = createMockStore(state);
    const wrapper = shallow(<DistrictActivityScores store={store} />);

    expect(wrapper.prop('schoolNames')).toEqual([
      'All Schools',
      'Bel-Air Academy',
      'South Park Elementary',
    ]);

    expect(wrapper.prop('teacherNames')).toEqual([
      'All Teachers',
      'Mr. Garrison',
      'Mrs. Crabtree',
    ]);

    expect(wrapper.prop('classroomNames')).toEqual([
      'All Classrooms',
      "Mrs. Crabtree's Morning Bus",
      "Mrs. Crabtree's Afternoon Bus",
    ]);
  });
});
