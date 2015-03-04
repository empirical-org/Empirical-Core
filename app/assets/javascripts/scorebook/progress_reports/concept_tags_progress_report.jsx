EC.ConceptTagsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    console.log('TODO Customize header names based on concept category data');
    return [
      {
        name: '',
        field: 'concept_tag_name',
        sortByField: 'concept_tag_name',
      },
      {
        name: '',
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: '',
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: '',
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

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         clientSideFiltering={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'concept_tags'} />
    );
  }
});