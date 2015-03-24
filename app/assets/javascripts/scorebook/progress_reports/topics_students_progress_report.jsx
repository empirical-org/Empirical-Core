EC.TopicsStudentsProgressReport = React.createClass({
  mixins: [EC.TimeSpentMixin],

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
      {
        name: this.state.topic.total_activity_session_count + ' Activities',
        field: 'activity_session_count',
        sortByField: 'activity_session_count'
      },
      {
        name: this.state.topic.proficient_count + ' Proficient',
        field: 'proficient_count',
        sortByField: 'proficient_count'
      },
      {
        name: this.state.topic.not_proficient_count + ' Not Proficient',
        field: 'not_proficient_count',
        sortByField: 'not_proficient_count'
      },
      {
        name: this.displayTimeSpent(this.state.topic.total_time_spent),
        field: 'total_time_spent',
        sortByField: 'total_time_spent',
        customCell: _.bind(function(row) {
          return this.displayTimeSpent(row['total_time_spent']);
        }, this)
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
    var topic = responseData.topic;
    topic.total_activity_session_count = _.reduce(responseData.students, function(memo, student) {
      return memo + student.activity_session_count;
    }, 0);
    // Calculate the total # of activity sessions completed.

    this.setState({
      topic: responseData.topic
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         onFetchSuccess={this.onFetchSuccess} />
    );
  }
});