import React from 'react'
import ProgressReport from '../progress_report.jsx'
import ScoreColor from '../../modules/score_color.js'



export default React.createClass({
  propTypes: {
    premiumStatus: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      students: {}
    }
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Score',
        field: 'score',
        sortByField: 'score',
        customCell: function(row) {
          return row['score'] + '%';
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
  },

  sortDefinitions: function() {
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
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      students: responseData.students
    });
  },

  colorByScore: function(grade){
    return ScoreColor(grade)
  },


  render: function() {
    const p = this.props.params;
    const unitActivityClassroom = `/u/${p.unitId}/a/${p.activityId}/c/${p.classroomId}`;
    return (
      <div id='individual-activity-classroom-view'>
        <ProgressReport
                           key={unitActivityClassroom}
                           columnDefinitions={this.columnDefinitions}
                           hideFaqLink={Boolean(true)}
                           pagination={false}
                           sourceUrl={`/teachers/progress_reports/question_view${unitActivityClassroom}`}
                           sortDefinitions={this.sortDefinitions}
                           jsonResultsKey={'data'}
                           colorByScore={Boolean(true)}
                           colorByScoreKeys={['score']}
                           filterTypes={[]}
                           premiumStatus={this.props.premiumStatus}
                           />
      </div>
    );
  }
});
