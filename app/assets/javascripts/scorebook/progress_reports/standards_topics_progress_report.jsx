"use strict";

EC.StandardsTopicsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      student: {}
    };
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Standard Level',
        field: 'section_name',
        sortByField: 'section_name',
        className: 'standard-level-column'
      },
      {
        name: 'Standard Name',
        field: 'name',
        sortByField: 'name',
        className: 'standard-name-column'
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
        className: 'mastery-status-column',
        customCell: function(row) {
          return <EC.MasteryStatus score={row['average_score']} />;
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural',
        section_name: 'natural',
        total_activity_count: 'numeric',
        average_score: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      student: responseData.student
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         onFetchSuccess={this.onFetchSuccess}
                         exportCsv={'standards_student_topics'}
                         jsonResultsKey={'topics'}
                         filterTypes={['unit']}>
        <h2>Standards: {this.state.student.name}</h2>
      </EC.ProgressReport>
    );
  }
});