import React from 'react';

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

export default KeyTargetSkillConcept;
