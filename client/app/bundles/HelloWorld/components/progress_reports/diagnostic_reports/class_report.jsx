import React from 'react'
import ProgressReport from '../progress_report.jsx'
import OverviewBoxes from './overview_boxes.jsx'



export default React.createClass({

  propTypes: {
    premiumStatus: React.PropTypes.string,
    params: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      students: null
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
    let startedNameRow, unstartedNameRow
    if (this.state.startedNames && this.state.startedNames.length > 0) {
      startedNameRow = this.renderStartedNames()
    }
    if (this.state.unstartedNames && this.state.unstartedNames.length > 0) {
      unstartedNameRow = this.renderUnstartedNames()
    }
    return <div style={{'marginTop': '20px', 'marginLeft': '10px'}}>
      {startedNameRow}
      {unstartedNameRow}
    </div>
   },

   renderStartedNames: function() {
     const startedNameRow = [<span style={{'fontWeight': 'bold'}}>In Progress: </span>]
     const numberOfNames = this.state.startedNames.length
     this.state.startedNames.forEach((name, i) => {
       if (numberOfNames === i + 1) {
         startedNameRow.push(<span>{name}.</span>)
       } else {
         startedNameRow.push(<span>{name}, </span>)
       }
     })
     return <p style={{'marginBottom': '10px'}}>{startedNameRow}</p>
   },

   renderUnstartedNames: function() {
     const unstartedNameRow = [<span style={{'fontWeight': 'bold'}}>Not Started: </span>]
     const numberOfNames = this.state.unstartedNames.length
     this.state.unstartedNames.forEach((name, i) => {
       if (numberOfNames === i + 1) {
         unstartedNameRow.push(<span>{name}.</span>)
       } else {
         unstartedNameRow.push(<span>{name}, </span>)
       }
     })
     return <p style={{'marginBottom': '10px'}}>{unstartedNameRow}</p>
   },

  render: function() {
    let overviewBoxes;
    if (this.state.students) {
      overviewBoxes = <OverviewBoxes data={this.state.students}/>
    }
    return (
      <div id='individual-classroom-view'>
        {overviewBoxes}
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
                           />
        {this.startedAndUnstartedStudents()}
      </div>
    );
  }
});
