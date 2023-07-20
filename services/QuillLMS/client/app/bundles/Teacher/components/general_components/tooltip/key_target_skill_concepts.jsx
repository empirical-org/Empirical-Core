import React from 'react';

import KeyTargetSkillConcept from './key_target_skill_concept';

const KeyTargetSkillConcepts = ({ groupedKeyTargetSkillConcepts, }) => {
  const statsRows = groupedKeyTargetSkillConcepts.map(statsRow => (
    <KeyTargetSkillConcept
      correct={statsRow.correct}
      incorrect={statsRow.incorrect}
      key={statsRow.name}
      name={statsRow.name}
    />)
  )

  return (
    <div className="key-target-skill-concepts container">
      <strong>Target Skill</strong>
      {statsRows}
    </div>
  );
}

export default KeyTargetSkillConcepts
