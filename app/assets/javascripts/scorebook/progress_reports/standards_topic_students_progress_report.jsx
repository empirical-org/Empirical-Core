"use strict";

EC.StandardsTopicStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      topic: {}
    };
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student Name',
        field: 'name',
        sortByField: 'sorting_name',
        className: 'student-name-column'
      },
      {
        name: 'Activities',
        field: 'total_activity_count',
        sortByField: 'total_activity_count',
        className: 'activities-column'
      },
      {
        name: 'Average',
        field: 'average_score',
        sortByField: 'average_score',
        className: 'average-score-column',
        customCell: function(row) {
          return Math.round(row['average_score'] * 100) + '%';
        }
      },
      {
        name: 'Mastery Status',
        field: 'average_score',
        sortByField: 'average_score',
        className: 'average-score-column',
        customCell: function(row) {
          return <EC.MasteryStatus score={row['average_score']} />;
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        sorting_name: 'natural',
        total_activity_count: 'numeric',
        average_score: 'numeric'
      },
      default: {
        field: 'sorting_name',
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
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         exportCsv={'standards_topic_students'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit']}>
        <h2>Standards: {this.state.topic.name}</h2>
      </EC.ProgressReport>
    );
  }
});