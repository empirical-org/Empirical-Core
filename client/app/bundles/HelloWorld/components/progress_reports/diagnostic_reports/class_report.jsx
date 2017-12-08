import React from 'react'
import ProgressReport from '../progress_report.jsx'
import OverviewBoxes from './overview_boxes.jsx'
import _ from 'underscore';

export default React.createClass({

  propTypes: {
    premiumStatus: React.PropTypes.string,
    params: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      students: null,
      showInProgressAndUnstartedStudents: false
    }
  },

  columnDefinitions: function() {
    let p = this.props.params
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (<a href={`/teachers/progress_reports/diagnostic_reports#/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}/student_report/${row.id}`}>{row['name']}</a>)
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
    ];
  },

  sortDefinitions: function() {
    return {
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
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      students: responseData.students,
      startedNames: responseData.started_names,
      unstartedNames: responseData.unstarted_names
    });
  },

  startedAndUnstartedStudents: function() {
    if (this.state.showInProgressAndUnstartedStudents) {
      const startedRows = _.map(this.state.startedNames, name => <tr key={name} className='in-progress-row'><td>{name}</td><td colSpan='3'>In Progress</td></tr>)
      const unstartedRows = _.map(this.state.unstartedNames, name => <tr key={name} className='unstarted-row'><td>{name}</td><td colSpan='3'>Not Started</td></tr>)
      return (
        <table className='student-report-box sortable-table'>
          <tbody>
            {startedRows}
            {unstartedRows}
          </tbody>
        </table>
      )
    }
   },

   showInProgressAndUnstartedStudents(bool) {
     this.setState({showInProgressAndUnstartedStudents: bool})
   },

  render: function() {
    let overviewBoxes;
    if (this.state.students) {
      overviewBoxes = <OverviewBoxes data={this.state.students}/>
    }
    return (
      <div id='individual-classroom-view'>
        {overviewBoxes}
        <div>
          <ProgressReport    key={this.props.params.classroomId}
                             columnDefinitions={this.columnDefinitions}
                             hideFaqLink={Boolean(true)}
                             pagination={false}
                             sourceUrl={`/teachers/progress_reports/students_by_classroom/u/${this.props.params.unitId}/a/${this.props.params.activityId}/c/${this.props.params.classroomId}`}
                             sortDefinitions={this.sortDefinitions}
                             jsonResultsKey={'students'}
                             colorByScoreKeys={['score']}
                             onFetchSuccess={this.onFetchSuccess}
                             filterTypes={[]}
                             premiumStatus={this.props.premiumStatus}
                             showInProgressAndUnstartedStudents={this.showInProgressAndUnstartedStudents}
                             />
          {this.startedAndUnstartedStudents()}
        </div>
      </div>
    );
  }
});
