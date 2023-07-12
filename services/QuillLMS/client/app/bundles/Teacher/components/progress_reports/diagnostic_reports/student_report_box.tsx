import * as React from 'react';

import { formatString, formatStringAndAddSpacesAfterPeriods, } from './formatString';

import { KeyTargetSkillConcept } from '../../../../interfaces/key_target_skill_concept';
import { Concept } from '../../../../interfaces/concept';
import QuestionData from '../../../../interfaces/questionData.ts';
import ScoreColor from '../../modules/score_color.js';
import ConceptResultTableRow from './concept_result_table_row.tsx';

export interface StudentReportBoxProps {
  boxNumber: number,
  questionData: QuestionData
}

export class StudentReportBox extends React.Component<StudentReportBoxProps> {

  renderConcepts = (concepts: Concept[]) => {
    return concepts.map((concept: { id: number }) => (
      <ConceptResultTableRow concept={concept} key={concept.id} />
    ));
  }

  renderDirections = (directions: string) => {
    return(
      <tr className='directions'>
        <td>Directions</td>
        <td />
        <td><span>{directions}</span></td>
      </tr>
    );
  }

  renderPrompt = (prompt: string) => {
    return(
      <tr>
        <td>Prompt</td>
        <td />
        <td><span dangerouslySetInnerHTML={{ __html: formatStringAndAddSpacesAfterPeriods(prompt)}} /></td>
      </tr>
    );
  }

  renderKeyTargetSkillConcept = (keyTargetSkillConcept: KeyTargetSkillConcept) => {
    return (
      <tr className={keyTargetSkillConcept.correct ? 'green-score-color' : ''}>
        <td>Key Target Skill</td>
        <td />
        <td>{keyTargetSkillConcept.name}</td>
      </tr>
    );
  }

  render() {
    const { boxNumber, questionData } = this.props;
    const { answer, concepts, directions, prompt, score, key_target_skill_concept, } = questionData;
    const formattedAnswer = answer ? formatString(answer) : ''
    return(
      <div className='individual-activity-report'>
        <div className="student-report-box">
          <div className='student-report-table-and-index'>
            <div className='question-index'>{boxNumber}</div>
            <table>
              <tbody>
                {directions && this.renderDirections(directions)}
                {prompt && this.renderPrompt(prompt)}
                {key_target_skill_concept && this.renderKeyTargetSkillConcept(key_target_skill_concept)}
                <tr className={(score || score === 0) && ScoreColor(score)}>
                  <td>Submission</td>
                  <td />
                  <td><span style={{ whiteSpace: 'pre-wrap' }}>{formattedAnswer}</span></td>
                </tr>
                {concepts && this.renderConcepts(concepts)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentReportBox;
