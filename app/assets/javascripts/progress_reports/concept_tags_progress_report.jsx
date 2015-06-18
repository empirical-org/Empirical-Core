EC.ConceptTagsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      conceptCategory: {}
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: this.state.conceptCategory.concept_category_name,
        field: 'concept_tag_name',
        sortByField: 'concept_tag_name',
        customCell: function(row) {
          return (
            <a href={row['students_href']}>{row['concept_tag_name']}</a>
          );
        }
      },
      {
        name: 'Total Results: ' + this.state.conceptCategory.total_result_count,
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: 'Correct Results: ' + this.state.conceptCategory.correct_result_count,
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: 'Incorrect Results: ' + this.state.conceptCategory.incorrect_result_count,
        field: 'incorrect_result_count',
        sortByField: 'incorrect_result_count'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        concept_tag_name: 'natural',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric'
      },
      default: {
        field: 'concept_tag_name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(data) {
    this.setState({conceptCategory: data.concept_category});
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'concept_tags'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit', 'classroom', 'student']}>
        <h2>Concepts</h2>
      </EC.ProgressReport>
    );
  }
});