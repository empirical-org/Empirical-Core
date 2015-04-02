"use strict";

EC.StandardsClassroomStudentsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['student_topics_href']}>{row['name']}</a>
          );
        }
      },
      {
        name: 'Standards',
        field: 'total_standard_count',
        sortByField: 'total_standard_count'
      },
      {
        name: 'Proficient',
        field: 'proficient_standard_count',
        sortByField: 'proficient_standard_count',
        customCell: function(row) {
          return <span className="proficient">{row['proficient_standard_count']} standards</span>;
        }
      },
      {
        name: 'Near Proficiency',
        field: 'near_proficient_standard_count',
        sortByField: 'near_proficient_standard_count',
        customCell: function(row) {
          return <span className="near-proficient">{row['near_proficient_standard_count']} standards</span>;
          return row['near_proficient_standard_count'] + ' standards';
        }
      },
      {
        name: 'Not Proficient',
        field: 'not_proficient_standard_count',
        sortByField: 'not_proficient_standard_count',
        customCell: function(row) {
          return <span className="not-proficient">{row['not_proficient_standard_count']} standards</span>;
        }
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
        name: 'natural',
        total_standard_count: 'numeric',
        proficient_standard_count: 'numeric',
        near_proficient_standard_count: 'numeric',
        not_proficient_standard_count: 'numeric',
        total_activity_count: 'numeric',
        average_score: 'numeric'
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
                         pagination={true}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         filterTypes={['unit']} />
    );
  }});