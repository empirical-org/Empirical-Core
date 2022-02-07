import React from 'react'
import ProgressReport from '../progress_report.jsx'
import { EVIDENCE_KEY, } from '../constants'

export default class QuestionReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      students: {}
    };
  }

  columnDefinitions = (activityClassification) => {
    return [
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell: function(row) {
          if (activityClassification === EVIDENCE_KEY) return 'N/A'
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
    const unitActivityClassroom = `/classroom/${p.classroomId}/activity/${p.activityId}/unit/${p.unitId}`;
    return (
      <div id='individual-activity-classroom-view'>
        <ProgressReport
          colorByScore={Boolean(true)}
          colorByScoreKeys={['score']}
          columnDefinitions={this.columnDefinitions}
          filterTypes={[]}
          hideFaqLink={Boolean(true)}
          jsonResultsKey="data"
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
