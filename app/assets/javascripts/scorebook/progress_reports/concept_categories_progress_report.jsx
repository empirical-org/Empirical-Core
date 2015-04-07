EC.ConceptCategoriesProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Concept Category',
        field: 'concept_category_name',
        sortByField: 'concept_category_name',
        customCell: function(row) {
          return (
            <a href={row['concept_tag_href']}>{row['concept_category_name']}</a>
          );
        }
      },
      {
        name: 'Total Results',
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: 'Correct Results',
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: 'Incorrect Results',
        field: 'incorrect_result_count',
        sortByField: 'incorrect_result_count'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        concept_category_name: 'natural',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric'
      },
      default: {
        field: 'concept_category_name',
        direction: 'asc'
      }
    };
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'concept_categories'}
                         filterTypes={['unit', 'classroom', 'student']}>
        <h2>Concepts</h2>
      </EC.ProgressReport>
    );
  }
});