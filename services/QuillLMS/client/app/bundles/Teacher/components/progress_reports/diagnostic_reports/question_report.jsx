import React from 'react'
import ProgressReport from '../progress_report.jsx'

export default class QuestionReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      students: {}
    };
  }

  columnDefinitions = () => {
    return [
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell: function(row) {
          return row['score'] === null ? 'Not Completed' : row['score'] + '%';
        }
      },
      {
        name: 'No.',
        field: 'question_id',
        sortByField: 'question_id'
      },
      {
        name: 'Instructions',
        field: 'instructions',
        sortByField: 'instructions'
      },
      {
        name: 'Prompt',
        field: 'prompt',
        sortByField: 'prompt'
      }
    ];
  };

  sortDefinitions = () => {
    return {
      config: {
        question_id: 'natural',
        score: 'numeric',
        instructions: 'natural',
        prompt: 'natural'
      },
      default: {
        field: 'score',
        direction: 'asc'
      }
    };
  };

  onFetchSuccess = (responseData) => {
    this.setState({
      students: responseData.students
    });
  };

  render() {
    const p = this.props.match.params;
    const unitActivityClassroom = `/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`;
    return (
      <div id='individual-activity-classroom-view'>
        <ProgressReport
          colorByScore={Boolean(true)}
          colorByScoreKeys={['score']}
          columnDefinitions={this.columnDefinitions}
          filterTypes={[]}
          hideFaqLink={Boolean(true)}
          jsonResultsKey={'data'}
          key={unitActivityClassroom}
          pagination={false}
          premiumStatus={this.props.premiumStatus}
          sortDefinitions={this.sortDefinitions}
          sourceUrl={`/teachers/progress_reports/question_view${unitActivityClassroom}`}
        />
      </div>
    );
  }
}
