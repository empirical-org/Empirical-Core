EC.ActivitiesProgressReport = React.createClass({
  columnDefinitions: function() {
    return [
      {
        name: 'App',
        field: 'activity_classification_name',
        sortByField: 'activity_classification_name'
      },
      {
        name: 'Activity',
        field: 'activity_name',
        sortByField: 'activity_name'
      },
      {
        name: 'Date',
        field: 'display_completed_at',
        sortByField: 'completed_at',
      },
      {
        name: 'Standard',
        field: 'standard', // What field is this?,
        sortByField: 'standard'
      },
      {
        name: 'Score',
        field: 'display_score',
        sortByField: 'percentage'
      },
      {
        name: 'Student',
        field: 'student_name',
        sortByField: 'student_name'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        completed_at: 'numeric',
        percentage: 'numeric',
        activity_classification_name: 'natural',
        standard: 'natural',
        student_name: 'natural'
      },
      default: {
        field: 'activity_classification_name',
        direction: 'asc'
      }
    };
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={true}
                         sourceUrl={'/teachers/progress_reports/activity_sessions'}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'activity_sessions'}
                         exportCsv={'activity_sessions'}
                         filterTypes={['unit', 'classroom', 'student']}>
        <h2>Activity Listing</h2>
      </EC.ProgressReport>
    );
  }
});