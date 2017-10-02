// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import ProgressReport from './progress_report.jsx'


export default React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired,
    premiumStatus: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      students: {}
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Name',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (
            <a className="concepts-view" href={row['concepts_href']}>{row['name']}</a>
          );
        }
      },
      {
        name: 'Questions',
        field: 'total_result_count',
        sortByField: 'total_result_count'
      },
      {
        name: 'Correct',
        field: 'correct_result_count',
        sortByField: 'correct_result_count'
      },
      {
        name: 'Incorrect',
        field: 'incorrect_result_count',
        sortByField: 'incorrect_result_count'
      },
      {
        name: 'Percentage',
        field: 'percentage',
        sortByField: 'percentage',
        customCell: function(row) {
          return row['percentage'] + '%';
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'lastName',
        total_result_count: 'numeric',
        correct_result_count: 'numeric',
        incorrect_result_count: 'numeric',
        percentage: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      students: responseData.students
    });
  },

  render: function() {
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={[]}
                         premiumStatus={this.props.premiumStatus}
                         >
        <section className="alert alert-warning">
          <p>
            We're upgrading this page since we have changed our scoring logic. <a href="http://support.quill.org/quill-premium/updates-to-the-concept-reports-page">Learn More <i className="fa fa-long-arrow-right"></i></a>
          </p>
        </section>
        <h2>Results by Student</h2>
        <br></br>
      </ProgressReport>
    );
  }
});
