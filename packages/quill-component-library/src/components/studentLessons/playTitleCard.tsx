import React from 'react';

const PlayTitleCard = ({ data, handleContinueClick, }) => (
  <div className="landing-page">
    <div className="landing-page-html" dangerouslySetInnerHTML={{__html: data.content}} />
    <button className="quill-button focus-on-light large primary contained" onClick={handleContinueClick} type="button">
      Continue
    </button>
  </div>
)

export { PlayTitleCard }
