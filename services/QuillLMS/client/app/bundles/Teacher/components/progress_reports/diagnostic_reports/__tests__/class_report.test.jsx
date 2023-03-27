import { shallow } from 'enzyme';
import React from 'react';

import { getTimeSpent } from '../../../../helpers/studentReports';
import ProgressReport from '../../progress_report.jsx';
import ClassReport from '../class_report.jsx';
import OverviewBoxes from '../overview_boxes.jsx';

describe('ClassReport component', () => {
  const CLASSROOM_ID = 42;
  const UNIT_ID = 424;
  const ACTIVITY_ID = 4242;

  const wrapper = shallow(
    <ClassReport
      match={{
        params: {
          classroomId: CLASSROOM_ID,
          unitId: UNIT_ID,
          activityId: ACTIVITY_ID
        }
      }}
      premiumStatus={false}
    />
  );

  it('returns the correct initial state', () => {
    expect(wrapper.state()).toEqual({showInProgressAndUnstartedStudents: false, students: null});
  });

  describe('overview boxes', () => {
    it('does not render if there are not students', () => {
      expect(wrapper.find(OverviewBoxes).exists()).toBe(false);
    });

    it('render if there are students', () => {
      wrapper.setState({
        students: [
          { name: 'Example Student', score: '100' },
          { name: 'Example Student', score: '75' },
          { name: 'Example Student', score: '33' },
        ]
      });
      expect(wrapper.find(OverviewBoxes).exists()).toBe(true);
    });
  });

  describe('progress report', () => {
    it('renders', () => {
      expect(wrapper.find(ProgressReport).exists()).toBe(true);
    });

    it('has the correct params', () => {
      const props = wrapper.find(ProgressReport).props();
      expect(props.hideFaqLink).toBe(true);
      expect(props.pagination).toBe(false);
      expect(props.sourceUrl).toBe(`/teachers/progress_reports/students_by_classroom/u/${UNIT_ID}/a/${ACTIVITY_ID}/c/${CLASSROOM_ID}`);
      expect(props.jsonResultsKey).toBe('students');
      expect(props.colorByScoreKeys).toEqual(['score']);
      expect(props.filterTypes).toEqual([]);
      expect(props.premiumStatus).toBe(false);
      expect(props.sortDefinitions()).toEqual({
        config: {
          name: 'lastName',
          question_id: 'natural',
          score: 'numeric',
          instructions: 'natural',
          prompt: 'natural',
          average_score_on_quill: 'numeric'
        },
        default: {
          field: 'score',
          direction: 'asc'
        }
      });
      expect(JSON.stringify(props.columnDefinitions())).toEqual(JSON.stringify([
        {
          name: 'Name',
          field: 'name',
          sortByField: 'name',
          customCell: function(row) {
            return (<a href={`/teachers/progress_reports/diagnostic_reports#/u/${UNIT_ID}/a/${ACTIVITY_ID}/c/${CLASSROOM_ID}/student_report/${row.id}`}>{row['name']}</a>)
          }
        },
        {
          name: 'Score',
          field: 'score',
          sortByField: 'score',
          customCell: function(row) {
            return row['score'] + '%'
          }
        },
        {
          name: 'Time spent',
          field: 'time',
          sortByField: 'time',
          customCell: function(row) {
            return getTimeSpent(row['time']);
          }
        },
        {
          name: 'Questions',
          field: 'number_of_questions',
          sortByField: 'number_of_questions',
          customCell: function(row) {
            return row['number_of_questions'];
          }
        },
        {
          name: 'Avg. score on Quill',
          field: 'average_score_on_quill',
          sortByField: 'average_score_on_quill',
          customCell: function(row) {
            return row['average_score_on_quill'] + '%'
          }
        }
      ]));
    });

    it('onFetchSuccess param sets state', () => {
      const students = [
        { name: 'Example Student', score: '100' },
        { name: 'Example Student', score: '75' },
        { name: 'Example Student', score: '33' },
      ];
      const notCompletedNames = ['Example A', 'Example B', 'Example C'];
      const missedNames = ['Example A, Example B, Example C'];
      wrapper.find(ProgressReport).props().onFetchSuccess({
        students: students,
        not_completed_names: notCompletedNames,
        missed_names: missedNames
      });
      expect(wrapper.state().students).toEqual(students);
      expect(wrapper.state().notCompletedNames).toEqual(notCompletedNames);
      expect(wrapper.state().missedNames).toEqual(missedNames);
    });
  });

  it('notCompletedNames render if there are started students and showInProgressAndUnstartedStudents is true', () => {
    wrapper.setState({ notCompletedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: true })
    expect(wrapper.find('.not-completed-row').length).toBe(3);
  });

  it('notCompletedNames not to render if there are started students and showInProgressAndUnstartedStudents is false', () => {
    wrapper.setState({ notCompletedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: false  })
    expect(wrapper.find('.not-completed-row').length).toBe(0);
  });

});
