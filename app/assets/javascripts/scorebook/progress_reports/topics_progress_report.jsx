EC.TopicsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    // section state is used to customize the column definitions.
    return {
      section: {}
    }
  },

  columnDefinitions: function() {
    // Derive column names from this.state.section
    return [
      {
        name: this.state.section.section_name,
        field: 'topic_name',
        sortByField: 'topic_name',
        customCell: function(row) {
          return (
            <a href={row['students_href']}>{row['topic_name']}</a>
          );
        }
      },
      {
        name: this.state.section.topics_count + ' Standards Completed',
        field: 'students_count',
        sortByField: 'students_count'
      },
      {
        name: this.state.section.proficient_count + ' Proficient',
        field: 'proficient_count',
        sortByField: 'proficient_count'
      },
      {
        name: this.state.section.not_proficient_count + ' Not Proficient',
        field: 'not_proficient_count',
        sortByField: 'not_proficient_count'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        topic_name: 'natural',
        students_count: 'numeric',
        proficient_count: 'numeric',
        not_proficient_count: 'numeric'
      },
      default: {
        field: 'topic_name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      section: responseData.section
    });
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'topics'}
                         onFetchSuccess={this.onFetchSuccess} />
    );
  }
});