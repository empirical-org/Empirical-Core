import React from 'react';
import { shallow } from 'enzyme';

import ClassReport from '../class_report.jsx';

import ProgressReport from '../../progress_report.jsx'
import OverviewBoxes from '../overview_boxes.jsx'

describe('ClassReport component', () => {
  const CLASSROOM_ID = 42;
  const UNIT_ID = 424;
  const ACTIVITY_ID = 4242;

  const wrapper = shallow(
    <ClassReport
      params={{
        classroomId: CLASSROOM_ID,
        unitId: UNIT_ID,
        activityId: ACTIVITY_ID
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
          time: 'numeric'
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
          name: 'Questions',
          field: 'number_of_questions',
          sortByField: 'number_of_questions',
          customCell: function(row) {
            return row['number_of_questions'];
          }
        },
        {
          name: 'Total Time',
          field: 'time',
          sortByField: 'time',
          customCell: function(row) {
            return row['time'] + ' min.';
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
      const startedNames = ['Example A', 'Example B', 'Example C'];
      const unstartedNames = ['Example A', 'Example B', 'Example C'];
      wrapper.find(ProgressReport).props().onFetchSuccess({
        students: students,
        started_names: startedNames,
        unstarted_names: unstartedNames
      });
      expect(wrapper.state().students).toEqual(students);
      expect(wrapper.state().startedNames).toEqual(startedNames);
      expect(wrapper.state().unstartedNames).toEqual(unstartedNames);
    });
  });

  it('startedRows render if there are started students and showInProgressAndUnstartedStudents is true', () => {
    wrapper.setState({ startedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: true })
    expect(wrapper.find('.in-progress-row').length).toBe(3);
  });

  it('startedRows not to render if there are started students and showInProgressAndUnstartedStudents is false', () => {
    wrapper.setState({ startedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: false  })
    expect(wrapper.find('.in-progress-row').length).toBe(0);
  });

  it('unstartedRows render if there are unstarted students and showInProgressAndUnstartedStudents is true', () => {
    wrapper.setState({ unstartedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: true  })
    expect(wrapper.find('.unstarted-row').length).toBe(3);
  });

  it('unstartedRows not to render if there are unstarted students and showInProgressAndUnstartedStudents is false', () => {
    wrapper.setState({ unstartedNames: ['Example A', 'Example B', 'Example C'], showInProgressAndUnstartedStudents: false  })
    expect(wrapper.find('.unstarted-row').length).toBe(0);
  });
});
