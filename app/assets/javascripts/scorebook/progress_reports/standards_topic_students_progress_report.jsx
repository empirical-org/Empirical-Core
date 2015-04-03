"use strict";

EC.StandardsTopicStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student Name',
        field: 'name',
        sortByField: 'sorting_name'
      },
      {
        name: 'Activities',
        field: 'total_activity_count',
        sortByField: 'total_activity_count'
      },
      {
        name: 'Average',
        field: 'average_score',
        sortByField: 'average_score',
        customCell: function(row) {
          return Math.round(row['average_score'] * 100) + '%';
        }
      },
      {
        name: 'Mastery Status',
        field: 'average_score',
        sortByField: 'average_score',
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

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={true}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         filterTypes={['unit']} />
    );
  }
});