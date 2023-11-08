import * as React from 'react';

import { getTimeSpent } from '../../../helpers/studentReports';
import ActivityDetails from './activity_details';
import KeyTargetSkillConcepts from './key_target_skill_concepts';
import numberSuffixBuilder from '../../modules/numberSuffixBuilder';
import PercentageDisplayer from '../../modules/percentage_displayer.jsx';
import ActivityDetailsSection from './activity_details_section';
import { NOT_APPLICABLE, Spinner } from '../../../../Shared'
import moment from 'moment';

const QUILL_DIAGNOSTIC_SCORING_EXPLANATION = "The Quill Diagnostic is meant to diagnose skills to practice. Students are not provided a color-coded score or percentage score. Teachers see only a percentage score without a color."
const percentageDisplayer = new PercentageDisplayer()

export const ScorebookTooltip = ({ data }) => {

  function activityOverview() {
    return (
      <div className="activity-overview">
        <ActivityDetails data={data} />
        {totalScoreOrNot()}
        {scoringExplanation()}
      </div>
    )
  }

  function keyTargetSkillConceptsOrExplanation() {
    if (data.marked_complete && data.completed_attempts === 0) {
      return <p className="no-data-message">This student has missed this lesson. To make up this material, you can assign this lesson again to the students who missed it.</p>
    } else if (data.scheduled && !data.completed_attempts) {
      return <p className="no-data-message">This scheduled activity has not been published.</p>;
    } else if (data.locked) {
      return <p className="no-data-message">This activity is set for staggered release and has not been unlocked by this student.</p>;
    } else if (!data.completed_attempts) {
      return <p className="no-data-message">This activity has not been completed.</p>;
    } else if (data.sessions && data.sessions.length) {
      return <KeyTargetSkillConcepts groupedKeyTargetSkillConcepts={data.sessions[data.sessions.length - 1].grouped_key_target_skill_concepts} />
    } else {
      return <Spinner />
    }
  };

  function displayScores() {
    const attemptInProgress = data.started > 0

    return data.sessions.map((session, i) => {
      const { percentage, number_of_correct_questions, number_of_questions, completed_at, timespent } = session
      const ordinalNumber = numberSuffixBuilder(i + 1)
      const formattedPercentage = percentageDisplayer.run(percentage)
      const scoreText = `${number_of_correct_questions} of ${number_of_questions} Target Skills Correct (${formattedPercentage})`
      const sessionLength = data.sessions.length
      let attemptText = ''

      if (attemptInProgress && i === sessionLength - 1) {
        const ordinalNumbers = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
        const nextNumber = sessionLength + 1
        const textifiedNextNumber = nextNumber > 10 ? numberSuffixBuilder(i + 1) : ordinalNumbers[nextNumber]
        attemptText = `(${textifiedNextNumber} attempt in progress)`
        const descriptionElement = <p className="description"><span className="percentage">{scoreText}</span><br /> {attemptText}</p>
        return <ActivityDetailsSection key={i} header={`${ordinalNumber} score`} description={descriptionElement} />
      }
      const descriptionElement = (
        <div className="description-block">
          <p className="description"><span className="percentage">{scoreText}</span> {attemptText}</p>
          <p className="description">{`${moment.utc(completed_at).format('MMMM D, YYYY [at] h:mm a')} / ${timespent ? getTimeSpent(timespent) : NOT_APPLICABLE}`}</p>
        </div>
      )
      return <ActivityDetailsSection key={i} header={`${ordinalNumber} score`} description={descriptionElement} />
    })
  };

  function totalScoreOrNot() {
    const hasScoreData = data.percentage && data.sessions && data.sessions.length > 0
    if (hasScoreData) {
      return displayScores()
    } else {
      return <span />
    }
  };

  function scoringExplanation() {
    const actClassId = data.activity ? data.activity.classification.id : data.activity_classification_id;
    if (Number(actClassId) === 4) {
      return <ActivityDetailsSection header="Scoring" description={QUILL_DIAGNOSTIC_SCORING_EXPLANATION} />
    }
  }

  const name = data.activity ? data.activity.name : data.name;
  return (
    <div className="scorebook-tooltip">
      <i className="fas fa-caret-up" />
      <i className="fas fa-caret-up border-color" />
      <div className="title">
        {name}
      </div>
      <div className="main">
        {activityOverview()}
        {keyTargetSkillConceptsOrExplanation()}
      </div>
    </div>
  )
}

export default ScorebookTooltip
