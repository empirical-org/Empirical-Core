"use strict";

EC.StandardsClassroomStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      classroom: {}
    };
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student',
        field: 'name',
        sortByField: 'sorting_name',
        className: 'student-name-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['student_topics_href']}>{row['name']}</a>
          );
        }
      },
      {
        name: 'Standards',
        field: 'total_standard_count',
        sortByField: 'total_standard_count',
        className: 'standards-column'
      },
      {
        name: 'Proficient',
        field: 'proficient_standard_count',
        sortByField: 'proficient_standard_count',
        className: 'proficient-column',
        customCell: function(row) {
          return <span>{row['proficient_standard_count']} standards</span>;
        }
      },
      {
        name: 'Nearly Proficient',
        field: 'near_proficient_standard_count',
        sortByField: 'near_proficient_standard_count',
        className: 'near-proficient-column',
        customCell: function(row) {
          return <span>{row['near_proficient_standard_count']} standards</span>;
        }
      },
      {
        name: 'Not Proficient',
        field: 'not_proficient_standard_count',
        sortByField: 'not_proficient_standard_count',
        className: 'not-proficient-column',
        customCell: function(row) {
          return <span>{row['not_proficient_standard_count']} standards</span>;
        }
      },
      {
        name: 'Activities',
        field: 'total_activity_count',
        sortByField: 'total_activity_count',
        className: 'activities-column',
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
        name: 'Overall Mastery Status',
        field: 'average_score',
        sortByField: 'average_score',
        className: 'overall-mastery-status-column',
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
        total_standard_count: 'numeric',
        proficient_standard_count: 'numeric',
        near_proficient_standard_count: 'numeric',
        not_proficient_standard_count: 'numeric',
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
      classroom: responseData.classroom
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         exportCsv={'standards_classroom_students'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit']}>
        <h2>Standards by Student: {this.state.classroom.name}</h2>
      </EC.ProgressReport>
    );
  }});