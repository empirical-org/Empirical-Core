import React from 'react';

import { getTimeSpent } from '../../../../helpers/studentReports';
import AboutPremium from '../../../general_components/tooltip/about_premium.jsx';
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx';
import KeyTargetSkillConcepts from '../../../general_components/tooltip/key_target_skill_concepts';
import numberSuffixBuilder from '../../numberSuffixBuilder';
import PercentageDisplayer from '../../percentage_displayer.jsx';
import ActivityDetailsSection from '../../../general_components/tooltip/activity_details_section';
import { NOT_APPLICABLE, Spinner } from '../../../../../Shared'
import moment from 'moment';

const percentageDisplayer = new PercentageDisplayer()

export default class ScorebookTooltip extends React.Component {
  aboutPremiumOrNot = () => {
    const { data } = this.props;
    if (data.concept_results && data.concept_results.length && !['trial', 'school', 'paid'].includes(data.premium_state)) {
      return <AboutPremium />;
    }
  };

  activityOverview() {
    const { data } = this.props;
    return (
      <div className="activity-overview">
        <ActivityDetails data={data} />
        {this.totalScoreOrNot()}
        {this.scoringExplanation()}
      </div>
    )
  }

  keyTargetSkillConceptsOrExplanation = () => {
    const { data } = this.props;
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

  displayScores = () => {
    const { data } = this.props;
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
        const textifiedNextNumber = nextNumber > 10 ? numberSuffixBuilder(textifiedNextNumber) : ordinalNumbers[nextNumber]
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

  totalScoreOrNot = () => {
    const { data } = this.props;
    if (data.percentage && data.sessions && data.sessions.length > 0) {
      return this.displayScores()
    } else {
      return <span />
    }
  };

  scoringExplanation = () => {
    const { data } = this.props;
    const actClassId = data.activity ? data.activity.classification.id : data.activity_classification_id;
    if (Number(actClassId) === 4 && data.percentage) {
      return <ActivityDetailsSection header="Scoring" description="Quill Diagnostic does not provide a score. You can click to view recommended activities based on the student's performance." />
    }
  }

  render() {
    const { data } = this.props;
    const name = data.activity ? data.activity.name : data.name;
    return (
      <div className="scorebook-tooltip" style={{ position: 'relative', }}>
        <i className="fas fa-caret-up" />
        <i className="fas fa-caret-up border-color" />
        <div className="title">
          {name}
        </div>
        <div className="main">
          {this.activityOverview()}
          {this.keyTargetSkillConceptsOrExplanation()}
        </div>
      </div>
    )
  }
};
