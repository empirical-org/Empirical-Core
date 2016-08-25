import React from 'react'
import ProgressReport from '../progress_report.jsx'
import OverviewBoxes from './overview_boxes.jsx'



export default React.createClass({

  propTypes: {
    premiumStatus: React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      students: null
    }
  },

  columnDefinitions: function() {
    let params = this.props.params
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (<a href={`/teachers/progress_reports/diagnostic_reports#${params.classroomId}/student_report?studentId=${row.id}`}>{row['name']}</a>)
        }
      },
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell: function(row) {
          console.log(row)
          return row['session']['score'] + '%'
        }
      },
      {
        name: 'Questions',
        field: 'number_of_questions',
        sortByField: 'number_of_questions',
        customCell: function(row) {
          return row['session']['number_of_questions'];
        }
      },
      {
        name: 'Total Time',
        field: 'time',
        sortByField: 'time',
        customCell: function(row) {
          return row['session']['time'] + ' min.';
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        question_id: 'natural',
        score: 'numeric',
        instructions: 'natural',
        prompt: 'natural'
      },
      default: {
        field: 'question_id',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      students: responseData.students
    });
  },


  render: function() {
    let overviewBoxes;
    if (this.state.students) {
      overviewBoxes = <OverviewBoxes data={this.state.students}/>
    }
    return (
      <div id='individual-classroom-view'>
        {overviewBoxes}
        <ProgressReport columnDefinitions={this.columnDefinitions}
                          hideFaqLink={Boolean(true)}
                           pagination={false}
                           sourceUrl={'/teachers/progress_reports/students_by_classroom/' + this.props.params.classroomId}
                           sortDefinitions={this.sortDefinitions}
                           jsonResultsKey={'students'}
                           colorByScoreKeys={['session','score']}
                           onFetchSuccess={this.onFetchSuccess}
                           filterTypes={[]}
                           premiumStatus={this.props.premiumStatus}
                           >
        </ProgressReport>
      </div>
    );
  }
});
