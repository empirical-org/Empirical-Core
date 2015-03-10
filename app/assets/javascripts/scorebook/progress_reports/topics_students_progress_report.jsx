EC.TopicsStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    // topic state is used to customize the column definitions.
    return {
      topic: {}
    }
  },

  columnDefinitions: function() {
    // Derive column names from this.state.topic
    return [
      {
        name: this.state.topic.topic_name,
        field: 'name',
        sortByField: 'name'
      },
      // TODO: This field is uncertain.
      // {
      //   name: this.state.topic.activities_count + ' Standards Completed',
      //   field: 'students_count',
      //   sortByField: 'students_count'
      // },
      {
        name: this.state.topic.proficient_count + ' Proficient',
        field: 'proficient_count',
        sortByField: 'proficient_count'
      },
      {
        name: this.state.topic.not_proficient_count + ' Not Proficient',
        field: 'not_proficient_count',
        sortByField: 'not_proficient_count'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural',
        // students_count: 'numeric',
        proficient_count: 'numeric',
        not_proficient_count: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      topic: responseData.topic
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         clientSideFiltering={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         onFetchSuccess={this.onFetchSuccess} />
    );
  }
});