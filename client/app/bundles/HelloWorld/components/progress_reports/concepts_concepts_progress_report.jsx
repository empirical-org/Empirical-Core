// The progress report shows all concepts for a given student.
import React from 'react'
import ProgressReport from './progress_report.jsx'


export default React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired,
    premiumStatus: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      concepts: {},
      student: {}
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Category',
        field: 'level_2_concept_name',
        sortByField: 'level_2_concept_name'
      },
      {
        name: 'Name',
        field: 'concept_name',
        sortByField: 'concept_name'
      },
      {
        name: 'Questions',
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: 'Correct',
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: 'Incorrect',
        field: 'incorrect_result_count',
        sortByField: 'incorrect_result_count'
      },
      {
        name: 'Percentage',
        field: 'percentage',
        sortByField: 'percentage',
        customCell: function(row) {
          return row['percentage'] + '%';
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        level_2_concept_name: 'natural',
        concept_name: 'natural',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric',
        percentage: 'numeric'
      },
      default: {
        field: 'concept_name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      student: responseData.student
    });
  },

  render: function() {
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'concepts'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={[]}
                         premiumStatus={this.props.premiumStatus}>
        <h2>{this.state.student.name}</h2>
      </ProgressReport>
    );
  }
});
