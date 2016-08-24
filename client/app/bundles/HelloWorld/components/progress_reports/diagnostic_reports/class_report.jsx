import React from 'react'
import ProgressReport from '../progress_report.jsx'
import OverviewBoxes from './overview_boxes.jsx'



export default React.createClass({
  propTypes: {
    premiumStatus: React.PropTypes.string.isRequired
  },



  getInitialState: function() {
    return {
      students: null,
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name'
      },
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell: function(row) {
          return row['session']['concept_results'][0]['score'] + '%';
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
    let overviewBoxes
    if (this.state.students) {
      overviewBoxes = <OverviewBoxes data={this.state.students}/>
    }
    return (
      <div id='individual-activity-classroom-view'>
        {overviewBoxes}
        <ProgressReport columnDefinitions={this.columnDefinitions}
                           pagination={false}
                           sourceUrl={'/teachers/progress_reports/students_by_classroom/' + this.props.classroom}
                           sortDefinitions={this.sortDefinitions}
                           jsonResultsKey={'students'}
                           colorByScoreKeys={['session', 'concept_results',1, 'score']}
                           onFetchSuccess={this.onFetchSuccess}
                           filterTypes={[]}
                           premiumStatus={this.props.premiumStatus}
                           >
        </ProgressReport>
      </div>
    );
  }
});
