import React from 'react'
import ProgressReport from '../progress_report.jsx'
import OverviewBoxes from './overview_boxes.jsx'
import MissedLessonRow from './missed_lesson_row.jsx'
import _ from 'underscore';

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
          return row['score'] + '%'
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
        name: 'Avg. Score on Quill',
        field: 'average_score_on_quill',
        sortByField: 'average_score_on_quill',
        customCell(row) {
          return row['average_score_on_quill'] + '%';
        }
      },
      {
        name: '',
        field: '',
        sortByField: '',
        customCell(row) {
          return (<a className="green-arrow" href={`/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${activityId}/c/${classroomId}/student_report/${row.id}`}>
            <img alt="" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
          </a>)
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

    const notCompletedRows = _.map(notCompletedNames, name => <tr className='unstarted-row' key={name}><td>{name}</td><td colSpan='3'>Not Completed</td></tr>)
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
        <div className="feedback-note">We would love to hear about your experience with our diagnostics. Please share your feedback by filling out this <a href="https://docs.google.com/forms/d/1iPmKjOO1KhvgF1tbj--kUVml40FSf-CTbRxcuYHij5Q/edit?usp=sharing" rel="noopener noreferrer" target="_blank">short feedback form</a>.</div>
      </div>
    );
  }
}
