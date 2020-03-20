import React from 'react'
import ScoreColor from '../../modules/score_color.js'
import ConceptResultTableRow from './concept_result_table_row.jsx'
import stripHtml from '../../modules/strip_html'

export default class extends React.Component {
  concepts = () => {
      return this.props.questionData.concepts.map((concept) => (
<ConceptResultTableRow concept={concept} key={concept.id} />
      ));
  };

  directions = () => {
      const directions = this.props.questionData.directions;
      if (directions) {
          return (
<tr className='directions'>
  <td>Directions</td>
  <td />
  <td><span>{directions}</span></td>
</tr>
          )
      }
  };

  prompt = () => {
      const prompt = this.props.questionData.prompt ? stripHtml(this.props.questionData.prompt) : '';
      if (prompt) {
          return (
<tr>
  <td>Prompt</td>
  <td />
  <td><span>{prompt}</span></td>
</tr>
          )
      }
  };

  answer = () => {
      return this.props.questionData.answer ? stripHtml(this.props.questionData.answer) : '';
  };

  render() {
      const data = this.props.questionData;
      return (
<div className='individual-activity-report'>
  <div className="student-report-box">
    <div className='student-report-table-and-index'>
      <div className='question-index'>{this.props.boxNumber}</div>
      <table>
        <tbody>
          {this.directions()}
          {this.prompt()}
          <tr className={ScoreColor(data.score)}>
            <td>Submission</td>
            <td />
            <td><span style={{ whiteSpace: 'pre-wrap' }}>{this.answer()}</span></td>
          </tr>
          {this.concepts()}
        </tbody>
      </table>
    </div>
  </div>
</div>
      );
  }
}
