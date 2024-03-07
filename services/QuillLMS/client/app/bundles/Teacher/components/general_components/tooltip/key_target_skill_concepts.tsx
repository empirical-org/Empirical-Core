import * as React from 'react';

import ActivityDetailsSection from './activity_details_section';

const KeyTargetSkillConcept = ({ name, correct, incorrect }) => {
  return (
    <div className="target-skill-container">
      <p>{name}</p>
      <div className="counts-container">
        <p className="correct-answer">{correct}</p>
        <p className="incorrect-answer">{incorrect}</p>
      </div>
    </div>
  );
};

export const KeyTargetSkillConcepts = ({ groupedKeyTargetSkillConcepts, }) => {
  const descriptionElement = (
    <div className="description-block">
      {groupedKeyTargetSkillConcepts.map(statsRow => (
        <KeyTargetSkillConcept
          correct={statsRow.correct}
          incorrect={statsRow.incorrect}
          key={statsRow.name}
          name={statsRow.name}
        />)
      )}
    </div>
  )
  return(
    <React.Fragment>
      {!!groupedKeyTargetSkillConcepts?.length && <ActivityDetailsSection customClass="target-skills-section" description={descriptionElement} header="Target Skills" />}
    </React.Fragment>
  )
}

export default KeyTargetSkillConcepts
