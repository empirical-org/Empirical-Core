import { mount, shallow } from 'enzyme';
import React from 'react';
import { createMockStore } from 'redux-test-utils';

import DistrictActivityScores from '../DistrictActivityScores.jsx';

import { FULL, LIMITED, RESTRICTED } from '../../shared';

const emptyState = {
  district_activity_scores: {
    loading: false,
    errors: false,
    selectedClassroom: 'All Classrooms',
    selectedSchool: 'All Schools',
    selectedTeacher: 'All Teachers',
    classroomsData: [],
  },
}

describe('DistrictActivityScores', () => {
  describe('when the access type is restricted', () => {
    it('renders', () => {
      const store = createMockStore(emptyState);
      const wrapper = mount(<DistrictActivityScores accessType={RESTRICTED} store={store} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the access type is limited', () => {
    it('renders', () => {
      const store = createMockStore(emptyState);
      const wrapper = mount(<DistrictActivityScores accessType={LIMITED} store={store} />);
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when the access type is full', () => {
    it('renders report for all students', () => {
      const classroom = {
        classroom_name: 'Learnin 101',
        schools_name: 'School of Hard Knocks',
        students_name: 'Lil Jimmy',
        teachers_name: 'Mr Rodney',
      };
      const state = {
        district_activity_scores: {
          loading: false,
          errors: false,
          selectedClassroom: 'All Classrooms',
          selectedSchool: 'All Schools',
          selectedTeacher: 'All Teachers',
          classroomsData: [classroom],
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictActivityScores accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictActivityScores').prop('filteredClassroomsData')).toEqual([classroom]);
    });

    it('formats csv data', () => {
      const classroom = {
        classroom_name: 'Learnin',
        schools_name: 'School',
        students_name: 'Lil Jimmy',
        teachers_name: 'Mr Rodney',
        average_score: '1',
        activity_count: '3',
      };
      const state = {
        district_activity_scores: {
          loading: false,
          errors: false,
          selectedClassroom: 'All Classrooms',
          selectedSchool: 'All Schools',
          selectedTeacher: 'All Teachers',
          classroomsData: [classroom],
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictActivityScores accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictActivityScores').prop('csvData')).toEqual([
        [
          'Classroom Name',
          'Student Name',
          'School Name',
          'Teacher Name',
          'Average Score',
          'Activity Count',
          'Time Spent',
          'Last Active'
        ],
        [
          'Learnin',
          'Lil Jimmy',
          'School',
          'Mr Rodney',
          '100%',
          '3',
          'N/A',
          undefined
        ]
      ]);
    });

    it('filters the report', () => {
      const classrooms = [
        {
          classroom_name: 'Learnin 101',
          schools_name: 'School of Hard Knocks',
          students_name: 'Lil Jimmy',
          teachers_name: 'Mr. Rodney',
        }, {
          classroom_name: 'Goodtimes.gif',
          schools_name: 'Kool School',
          students_name: 'Lil Kim',
          teachers_name: 'Mr. Smith',
        }, {
          classroom_name: 'What what',
          schools_name: 'Kool School',
          students_name: 'Lil Bub',
          teachers_name: 'Ms. Applebee',
        }, {
          classroom_name: 'Yeah Learning!',
          schools_name: 'Kool School',
          students_name: 'Rick',
          teachers_name: 'Ms. Applebee',
        }
      ];
      const state = {
        district_activity_scores: {
          loading: false,
          errors: false,
          selectedClassroom: 'Yeah Learning!',
          selectedSchool: 'Kool School',
          selectedTeacher: 'Ms. Applebee',
          classroomsData: classrooms,
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictActivityScores accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictActivityScores').prop('filteredClassroomsData')).toEqual([{
        classroom_name: 'Yeah Learning!',
        schools_name: 'Kool School',
        students_name: 'Rick',
        teachers_name: 'Ms. Applebee',
      }]);
    });

    it('populates the dropdown options', () => {
      const classrooms = [
        {
          classroom_name: 'Learnin 101',
          schools_name: 'School of Hard Knocks',
          students_name: 'Lil Jimmy',
          teachers_name: 'Mr. Rodney',
        }, {
          classroom_name: 'Goodtimes.gif',
          schools_name: 'Kool School',
          students_name: 'Lil Kim',
          teachers_name: 'Mr. Smith',
        }, {
          classroom_name: 'What what',
          schools_name: 'Kool School',
          students_name: 'Lil Bub',
          teachers_name: 'Ms. Applebee',
        }, {
          classroom_name: 'Yeah Learning!',
          schools_name: 'Kool School',
          students_name: 'Rick',
          teachers_name: 'Ms. Applebee',
        }
      ];
      const state = {
        district_activity_scores: {
          loading: false,
          errors: false,
          selectedClassroom: 'Yeah Learning!',
          selectedSchool: 'Kool School',
          selectedTeacher: 'Ms. Applebee',
          classroomsData: classrooms,
        },
      };
      const store = createMockStore(state);
      const wrapper = shallow(<DistrictActivityScores accessType={FULL} store={store} />);

      expect(wrapper.find('DistrictActivityScores').prop('schoolNames')).toEqual([
        'All Schools',
        'School of Hard Knocks',
        'Kool School'
      ]);

      expect(wrapper.find('DistrictActivityScores').prop('teacherNames')).toEqual([
        'All Teachers',
        'Mr. Smith',
        'Ms. Applebee'
      ]);

      expect(wrapper.find('DistrictActivityScores').prop('classroomNames')).toEqual([
        'All Classrooms',
        'What what',
        'Yeah Learning!'
      ]);
    });
  })

});
