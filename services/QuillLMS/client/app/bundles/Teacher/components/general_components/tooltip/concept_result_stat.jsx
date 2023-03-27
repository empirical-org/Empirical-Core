import React from 'react';

const ConceptResultStat = (
  {
    name,
    correct,
    incorrect,
  },
) => {
  return (
    <div className='row'>
      <div className='col-xs-8 no-pl'>{name}</div>
      <div className='col-xs-2 correct-answer'>{correct}</div>
      <div className='col-xs-2 no-pr incorrect-answer'>{incorrect}</div>
    </div>
  );
};

export default ConceptResultStat;
