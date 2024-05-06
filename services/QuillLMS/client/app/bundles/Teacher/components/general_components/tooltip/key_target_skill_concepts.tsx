import * as React from 'react';

import ActivityDetailsSection from './activity_details_section';

const KeyTargetSkillConcept = ({ name, correct, incorrect, shouldShowCounts }) => {
  let counts

  if (shouldShowCounts) {
    counts = (
      <div className="counts-container">
        <p className="correct-answer">{correct}</p>
        <p className="incorrect-answer">{incorrect}</p>
      </div>
    )
  }

  return (
    <div className="target-skill-container">
      <p>{name}</p>
      {counts}
    </div>
  );
};

export const KeyTargetSkillConcepts = ({ groupedKeyTargetSkillConcepts, shouldShowCounts, }) => {
  const descriptionElement = (
    <div className="description-block">
      {groupedKeyTargetSkillConcepts.map(statsRow => (
        <KeyTargetSkillConcept
          correct={statsRow.correct}
          incorrect={statsRow.incorrect}
          key={statsRow.name}
          name={statsRow.name}
          shouldShowCounts={shouldShowCounts}
        />)
      )}
    </div>
  )
  return(
    !!groupedKeyTargetSkillConcepts?.length ? <ActivityDetailsSection customClass="target-skills-section" description={descriptionElement} header="Target Skills" /> : <span />
  )
}

export default KeyTargetSkillConcepts
