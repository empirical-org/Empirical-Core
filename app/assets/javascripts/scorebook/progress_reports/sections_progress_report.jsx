//= require ./table_filter_mixin.js
//= require ./table_sorting_mixin.js

EC.SectionsProgressReport = React.createClass({

  columnDefinitions: function() {
    return [
      {
        name: 'Grade Level',
        field: 'section_name',
        sortByField: 'section_name',
        customCell: function(row) {
          return (
            <a href={row['section_link']}>{row['section_name']}</a>
          );
        }
      },
      {
        name: 'Standards Completed',
        field: 'topics_count',
        sortByField: 'topics_count'
      },
      {
        name: 'Proficient',
        field: 'proficient_count',
        sortByField: 'proficient_count'
      },
      {
        name: 'Not Proficient',
        field: 'not_proficient_count',
        sortByField: 'not_proficient_count'
      },
      {
        name: 'Time Spent',
        field: 'total_time_spent',
        sortByField: 'total_time_spent'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        section_name: 'natural',
        topics_count: 'numeric',
        proficient_count: 'numeric',
        not_proficient_count: 'numeric',
        total_time_spent: 'numeric'
      },
      default: {
        field: 'section_name',
        direction: 'asc'
      }
    };
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         clientSideFiltering={false}
                         sourceUrl={'/teachers/progress_reports/sections'}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'sections'} />
    );
  }
});