import React from 'react';

import KeyTargetSkillConcept from './key_target_skill_concept';
import ActivityDetailsSection from './activity_details_section';

const KeyTargetSkillConcepts = ({ groupedKeyTargetSkillConcepts, }) => {
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
      {!!groupedKeyTargetSkillConcepts?.length && <ActivityDetailsSection header="Target Skills" description={descriptionElement} />}
      <p className="tooltip-message">Clicking on the activity icon loads the report</p>
    </React.Fragment>
  )
}

export default KeyTargetSkillConcepts
