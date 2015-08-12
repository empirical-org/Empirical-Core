// The progress report shows all concepts for a given student.

EC.ConceptsConceptsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
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
        concept_name: 'natural',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric'
      },
      default: {
        field: 'concept_name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      students: responseData.concepts
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'concepts'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={[]}>
        <h2>Results by Concept</h2>
      </EC.ProgressReport>
    );
  }
});