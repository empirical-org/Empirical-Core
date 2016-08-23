import React from 'react'
import ProgressReport from '../progress_report.jsx'



export default React.createClass({
  propTypes: {
    premiumStatus: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      students: {}
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
          return row['score'] + '%';
        }
      },
      {
        name: 'Questions',
        field: 'number_of_questions',
        sortByField: 'number_of_questions'
      },
      {
        name: 'Total Time',
        field: 'time',
        sortByField: 'time'
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

  colorByScore: function(grade){
    return ScoreColor(grade)
  },

  render: function() {
    return (
      <div id='individual-activity-classroom-view'>
        <ProgressReport columnDefinitions={this.columnDefinitions}
                           pagination={false}
                           sourceUrl={'/teachers/progress_reports/question_view'}
                           sortDefinitions={this.sortDefinitions}
                           jsonResultsKey={'data'}
                           colorByScore={Boolean(true)}
                          // onFetchSuccess={this.onFetchSuccess}
                           filterTypes={[]}
                           premiumStatus={this.props.premiumStatus}
                           >
        </ProgressReport>
      </div>
    );
  }
});
