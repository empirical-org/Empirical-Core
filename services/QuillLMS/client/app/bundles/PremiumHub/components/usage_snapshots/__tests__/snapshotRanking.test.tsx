import { mount } from 'enzyme';
import * as React from 'react';

import { timeframes, grades, schools, teachers, classrooms, } from './data'

import { SMALL, NEGATIVE, POSITIVE, MEDIUM, } from '../shared'
import SnapshotRanking from '../snapshotRanking';

const data = [
  {value: "Comma Before Coordinating Conjunctions", count: 3777 },
  {value: "Compound Objects", count: 3339 },
  {value: "Subordinating Conjunction at the Beginning of a Sentence", count: 2232 },
  {value: "Gerunds as Subjects", count: 456 },
  {value: "Split Infinitives", count: 789 },
  {value: "Parallel Structure", count: 1234 },
  {value: "Subject-Verb Agreement", count: 5678 },
  {value: "Pronoun-Antecedent Agreement", count: 9012 },
  {value: "Appositive Phrases", count: 3456 },
  {value: "Dangling Modifiers", count: 7890 }
]


describe('SnapshotRanking component', () => {
  const mockProps = {
    label: 'Sentences written',
    queryKey: 'sentences-written',
    searchCount: 1,
    selectedGrades: grades.map(g => g.value),
    selectedSchoolIds: schools.map(s => s.id),
    selectedTeacherIds: teachers.map(s => s.id),
    selectedClassroomIds: classrooms.map(s => s.id),
    selectedTimeframe: timeframes[0].value,
    adminId: 1,
    customTimeframeStart: null,
    customTimeframeEnd: null,
    comingSoon: false,
    headers: ['Teacher', 'Activities completed']
  }

  describe ('when it is coming soon', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotRanking {...mockProps} comingSoon={true} />);

      expect(component).toMatchSnapshot();
    });
  })

  describe ('when there is no data ', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotRanking {...mockProps} />);

      expect(component).toMatchSnapshot();
    });
  })

  describe ('when there is data ', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotRanking {...mockProps} passedData={data} />);

      expect(component).toMatchSnapshot();
    });
  })


});
