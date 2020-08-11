import React from 'react';

const PlayTitleCard = ({ data, handleContinueClick, isLastQuestion, }) => (
  <div className="landing-page">
    <div className="landing-page-html" dangerouslySetInnerHTML={{__html: data.content}} />
    <button className="quill-button focus-on-light large primary contained" onClick={handleContinueClick} type="button">
      {isLastQuestion ? 'Next' : 'Continue'}
    </button>
  </div>
)

export { PlayTitleCard }
