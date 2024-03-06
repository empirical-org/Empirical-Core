import * as React from 'react';

import { getTimeSpent } from '../../../helpers/studentReports';
import ActivityDetails from './activity_details';
import KeyTargetSkillConcepts from './key_target_skill_concepts';
import numberSuffixBuilder from '../../modules/numberSuffixBuilder';
import PercentageDisplayer from '../../modules/percentage_displayer.jsx';
import ActivityDetailsSection from './activity_details_section';
import { NOT_APPLICABLE, Spinner } from '../../../../Shared'
import moment from 'moment';

const ORDINAL_NUMBERS = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
const QUILL_DIAGNOSTIC_SCORING_EXPLANATION = "The Quill Diagnostic is meant to diagnose skills to practice. Students are not provided a color-coded score or percentage score. Teachers see only a percentage score without a color."
const percentageDisplayer = new PercentageDisplayer()

interface Session {
  grouped_key_target_skill_concepts: any;
  percentage: number;
  number_of_correct_questions: number;
  number_of_questions: number;
  completed_at: string;
  timespent: number;
}

interface ActivityClassification {
  id: number;
}

interface Activity {
  classification: ActivityClassification;
  name: string;
}

interface ScorebookTooltipData {
  completed_attempts: Number;
  name: string; // this is the activity name
  activity_classification_id: Boolean;
  percentage: number;
  activity?: Activity;
  started?: number;
  sessions?: Array<Session>
  locked?: Boolean;
  scheduled?: Boolean;
  marked_complete?: Boolean;
}

interface ScorebookTooltipProps {
  data: ScorebookTooltipData
}

export const ScorebookTooltip = ({ data }: ScorebookTooltipProps) => {

  if (!Object.keys(data).length) { return <span /> }

  const { marked_complete, completed_attempts, locked, scheduled, sessions, started, activity, name } = data

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
    if (marked_complete && completed_attempts === 0) {
      return <p className="no-data-message">This student has missed this lesson. To make up this material, you can assign this lesson again to the students who missed it.</p>
    } else if (scheduled && !completed_attempts) {
      return <p className="no-data-message">This scheduled activity has not been published.</p>
    } else if (locked) {
      return <p className="no-data-message">This activity is set for staggered release and has not been unlocked by this student.</p>
    } else if (!completed_attempts) {
      return <p className="no-data-message">This activity has not been completed.</p>
    } else if (sessions && sessions.length) {
      return <KeyTargetSkillConcepts groupedKeyTargetSkillConcepts={sessions[sessions.length - 1].grouped_key_target_skill_concepts} />
    } else {
      return <Spinner />
    }
  };

  function displayScores() {
    const attemptInProgress = started > 0

    return sessions.map((session, i) => {
      const { percentage, number_of_correct_questions, number_of_questions, completed_at, timespent } = session
      const ordinalNumber = numberSuffixBuilder(i + 1)
      const formattedPercentage = percentageDisplayer.run(percentage)
      const scoreText = `${number_of_correct_questions} of ${number_of_questions} Target Skills Correct (${formattedPercentage})`
      const sessionLength = sessions.length
      let attemptText = ''

      if (attemptInProgress && i === sessionLength - 1) {
        const nextNumber = sessionLength + 1
        const textifiedNextNumber = nextNumber > 10 ? numberSuffixBuilder(i + 1) : ORDINAL_NUMBERS[nextNumber]
        attemptText = `(${textifiedNextNumber} attempt in progress)`
        const descriptionElement = <p className="description"><span className="percentage">{scoreText}</span><br /> {attemptText}</p>
        return <ActivityDetailsSection description={descriptionElement} header={`${ordinalNumber} score`} key={i} />
      }
      const descriptionElement = (
        <div className="description-block">
          <p className="description"><span className="percentage">{scoreText}</span> {attemptText}</p>
          <p className="description">{`${moment.utc(completed_at).format('MMMM D, YYYY [at] h:mm a')} / ${timespent ? getTimeSpent(timespent) : NOT_APPLICABLE}`}</p>
        </div>
      )
      return <ActivityDetailsSection description={descriptionElement} header={`${ordinalNumber} score`} key={i} />
    })
  };

  function totalScoreOrNot() {
    const { percentage, sessions } = data
    const hasScoreData = percentage && sessions && sessions.length > 0
    if (hasScoreData) {
      return displayScores()
    } else {
      return <span />
    }
  };

  function scoringExplanation() {
    const { activity, activity_classification_id } = data
    const actClassId = activity ? activity.classification.id : activity_classification_id;
    if (Number(actClassId) === 4) {
      return <ActivityDetailsSection description={QUILL_DIAGNOSTIC_SCORING_EXPLANATION} header="Scoring" />
    }
  }

  const title = activity ? activity.name : name;
  return (
    <div className="scorebook-tooltip">
      <i className="fas fa-caret-up" />
      <i className="fas fa-caret-up border-color" />
      <div className="title">
        {title}
      </div>
      <div className="main">
        {activityOverview()}
        {keyTargetSkillConceptsOrExplanation()}
      </div>
    </div>
  )
}

export default ScorebookTooltip
