import React from 'react'
// The progress report showing all students in a given classroom
// along with their result counts.
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
        name: 'Questions',
        field: 'question_id',
        sortByField: 'question_id'
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
        name: 'instructions',
        field: 'instructions',
        sortByField: 'instructions'
      },
      {
        name: 'prompt',
        field: 'prompt',
        sortByField: 'prompt'
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
    console.log('in progress report')
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={'/teachers/progress_reports/question_view'}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'data'}
                        // onFetchSuccess={this.onFetchSuccess}
                         filterTypes={[]}
                         premiumStatus={this.props.premiumStatus}
                         >
      </ProgressReport>
    );
  }
});
