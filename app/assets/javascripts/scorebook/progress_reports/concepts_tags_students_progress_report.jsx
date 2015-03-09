// The progress report showing a per-student breakdown for a given
// concept tag.

EC.ConceptTagsStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student Name',
        field: 'name',
        sortByField: 'name',
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural'
      },
      default: {
        field: 'name',
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
                         jsonResultsKey={'students'} />
    );
  }
});