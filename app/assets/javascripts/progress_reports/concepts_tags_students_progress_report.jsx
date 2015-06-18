// The progress report showing a per-student breakdown for a given
// concept tag.

EC.ConceptTagsStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      conceptTag: {}
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: this.state.conceptTag.concept_tag_name,
        field: 'name',
        sortByField: 'name',
      },
      {
        name: 'Total Results: ' + this.state.conceptTag.total_result_count,
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: 'Correct Results: ' + this.state.conceptTag.correct_result_count,
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: 'Incorrect Results: ' + this.state.conceptTag.incorrect_result_count,
        field: 'incorrect_result_count',
        sortByField: 'incorrect_result_count'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      conceptTag: responseData.concept_tag
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit', 'classroom', 'student']}>
        <h2>Results by Student</h2>
      </EC.ProgressReport>
    );
  }
});