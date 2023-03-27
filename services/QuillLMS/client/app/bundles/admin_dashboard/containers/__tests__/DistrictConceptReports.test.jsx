import { mount, shallow } from 'enzyme';
import React from 'react';
import { createMockStore } from 'redux-test-utils';

import DistrictConceptReports from '../DistrictConceptReports.jsx';

import { FULL, LIMITED, RESTRICTED } from '../../shared';

const emptyState = {
  district_concept_reports: {
    loading: false,
    errors: false,
    selectedClassroom: 'All Classrooms',
    selectedSchool: 'All Schools',
    selectedTeacher: 'All Teachers',
    conceptReportsData: [],
  },
}

describe('DistrictConceptReports', () => {
  describe('when the access type is restricted', () => {
    it('renders', () => {
      const store = createMockStore(emptyState);
      const wrapper = mount(<DistrictConceptReports accessType={RESTRICTED} store={store} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the access type is limited', () => {
    it('renders', () => {
      const store = createMockStore(emptyState);
      const wrapper = mount(<DistrictConceptReports accessType={LIMITED} store={store} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the access type is full', () => {
    it('renders report for all students', () => {
      const classroom = {
        classroom_name: 'Professor Trelawney - Divination',
        school_name: 'Hogwarts',
        student_name: 'Parvati Patil',
        teacher_name: 'Sybill Trelawney',
      };
      const state = {
        district_concept_reports: {
          loading: false,
          errors: false,
          selectedClassroom: 'All Classrooms',
          selectedSchool: 'All Schools',
          selectedTeacher: 'All Teachers',
          conceptReportsData: [classroom],
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictConceptReports accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictConceptReports').prop('filteredConceptReportsData')).toEqual([classroom]);
    });

    it('formats csv data', () => {
      const classroom = {
        classroom_name: 'Mrs. Krabapple - 4th Grade',
        school_name: 'Springfield Elementary',
        student_name: 'Bart Simpson',
        teacher_name: 'Mrs. Krabapple',
        correct: '12',
        incorrect: '20',
        percentage: '37',
      };
      const state = {
        district_concept_reports: {
          loading: false,
          errors: false,
          selectedClassroom: 'All Classrooms',
          selectedSchool: 'All Schools',
          selectedTeacher: 'All Teachers',
          conceptReportsData: [classroom],
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictConceptReports accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictConceptReports').prop('csvData')).toEqual([
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
          'Mrs. Krabapple - 4th Grade',
          'Springfield Elementary',
          '12',
          '20',
          '37'
        ]
      ]);
    });

    it('filters the report', () => {
      const classrooms = [
        {
          classroom_name: 'Poetry 101',
          school_name: 'Bel-Air Academy',
          student_name: 'Carlton Banks',
          teacher_name: 'Ned Fellows',
        }, {
          classroom_name: "Mr. Garrison's 4th Grade",
          school_name: 'South Park Elementary',
          student_name: 'Eric Cartman',
          teacher_name: 'Mr. Garrison',
        }, {
          classroom_name: "Mrs. Crabtree's Morning Bus",
          school_name: 'South Park Elementary',
          student_name: 'Stan Marsh',
          teacher_name: 'Mrs. Crabtree',
        }, {
          classroom_name: "Mrs. Crabtree's Afternoon Bus",
          school_name: 'South Park Elementary',
          student_name: 'Butters',
          teacher_name: 'Mrs. Crabtree',
        }
      ];
      const state = {
        district_concept_reports: {
          loading: false,
          errors: false,
          selectedClassroom: "Mrs. Crabtree's Afternoon Bus",
          selectedSchool: 'South Park Elementary',
          selectedTeacher: 'Mrs. Crabtree',
          conceptReportsData: classrooms,
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictConceptReports accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictConceptReports').prop('filteredConceptReportsData')).toEqual([{
        classroom_name: "Mrs. Crabtree's Afternoon Bus",
        school_name: 'South Park Elementary',
        student_name: 'Butters',
        teacher_name: 'Mrs. Crabtree',
      }]);
    });

    it('populates the dropdown options', () => {
      const classrooms = [
        {
          classroom_name: 'Poetry 101',
          school_name: 'Bel-Air Academy',
          student_name: 'Carlton Banks',
          teacher_name: 'Ned Fellows',
        }, {
          classroom_name: "Mr. Garrison's 4th Grade",
          school_name: 'South Park Elementary',
          student_name: 'Eric Cartman',
          teacher_name: 'Mr. Garrison',
        }, {
          classroom_name: "Mrs. Crabtree's Morning Bus",
          school_name: 'South Park Elementary',
          student_name: 'Stan Marsh',
          teacher_name: 'Mrs. Crabtree',
        }, {
          classroom_name: "Mrs. Crabtree's Afternoon Bus",
          school_name: 'South Park Elementary',
          student_name: 'Butters',
          teacher_name: 'Mrs. Crabtree',
        }
      ];
      const state = {
        district_concept_reports: {
          loading: false,
          errors: false,
          selectedClassroom: "Mrs. Crabtree's Afternoon Bus",
          selectedSchool: 'South Park Elementary',
          selectedTeacher: 'Mrs. Crabtree',
          conceptReportsData: classrooms,
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictConceptReports accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictConceptReports').prop('schoolNames')).toEqual([
        'All Schools',
        'Bel-Air Academy',
        'South Park Elementary'
      ]);

      expect(wrapper.find('DistrictConceptReports').prop('teacherNames')).toEqual([
        'All Teachers',
        'Mr. Garrison',
        'Mrs. Crabtree'
      ]);

      expect(wrapper.find('DistrictConceptReports').prop('classroomNames')).toEqual([
        'All Classrooms',
        "Mrs. Crabtree's Morning Bus",
        "Mrs. Crabtree's Afternoon Bus"
      ]);
    });
  })
});
