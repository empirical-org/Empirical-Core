import React from 'react';
import _ from 'underscore';

import MissedLessonRow from './missed_lesson_row.jsx';
import OverviewBoxes from './overview_boxes.jsx';

import { getTimeSpent } from '../../../helpers/studentReports';
import ProgressReport from '../progress_report.jsx';

export default class ClassReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      students: null,
      showInProgressAndUnstartedStudents: false
    }
  }

  columnDefinitions = () => {
    const { match, } = this.props
    const { unitId, activityId, classroomId, } = match.params
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        customCell(row) {
          return (<a href={`/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${activityId}/c/${classroomId}/student_report/${row.id}`}>{row['name']}</a>)
        }
      },
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell(row) {
          return row['score'] || row['score'] === 0 ? row['score'] + '%' : 'N/A'
        }
      },
      {
        name: 'Time spent',
        field: 'time',
        sortByField: 'time',
        customCell(row) {
          return getTimeSpent(row['time']);
        }
      },
      {
        name: 'Questions',
        field: 'number_of_questions',
        sortByField: 'number_of_questions',
        customCell(row) {
          return row['number_of_questions'];
        }
      },
      {
        name: 'Avg. score on Quill',
        field: 'average_score_on_quill',
        sortByField: 'average_score_on_quill',
        customCell(row) {
          return row['average_score_on_quill'] + '%';
        }
      }
    ];
  }

  handleFetchSuccess = (responseData) => {
    this.setState({
      students: responseData.students,
      notCompletedNames: this.sortByLastName(responseData.not_completed_names),
      missedNames: this.sortByLastName(responseData.missed_names)
    });
  }

  showInProgressAndUnstartedStudents = (bool) => this.setState({ showInProgressAndUnstartedStudents: bool })

  sortByLastName(names) {
    return names.sort((a, b) => {
      const aLast = a.split(' ')[1]
      const bLast = b.split(' ')[1]
      return aLast.localeCompare(bLast)
    })
  }

  sortDefinitions() {
    return {
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
    };
  }

  startedAndUnstartedStudents() {
    const { showInProgressAndUnstartedStudents, notCompletedNames, missedNames, } = this.state
    if (!showInProgressAndUnstartedStudents) { return }

    const notCompletedRows = _.map(notCompletedNames, name => <tr className='not-completed-row' key={name}><td>{name}</td><td colSpan='3'>Not Completed</td></tr>)
    const missedRows = _.map(missedNames, name => <MissedLessonRow name={name} />)
    return (
      <table className='student-report-box sortable-table'>
        <tbody>
          {notCompletedRows}
          {missedRows}
        </tbody>
      </table>
    )
  }

  render() {
    const { students, } = this.state
    const { match, premiumStatus, } = this.props
    const overviewBoxes = students ? <OverviewBoxes data={students} /> : null

    return (
      <div id='individual-classroom-view'>
        {overviewBoxes}
        <div>
          <ProgressReport
            colorByScoreKeys={['score']}
            columnDefinitions={this.columnDefinitions}
            filterTypes={[]}
            hideFaqLink={Boolean(true)}
            jsonResultsKey='students'
            key={match.params.classroomId}
            onFetchSuccess={this.handleFetchSuccess}
            pagination={false}
            premiumStatus={premiumStatus}
            showInProgressAndUnstartedStudents={this.showInProgressAndUnstartedStudents}
            sortDefinitions={this.sortDefinitions}
            sourceUrl={`/teachers/progress_reports/students_by_classroom/u/${match.params.unitId}/a/${match.params.activityId}/c/${match.params.classroomId}`}
          />
          {this.startedAndUnstartedStudents()}
        </div>
      </div>
    );
  }
}
