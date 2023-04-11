import * as React from 'react';

const PlayTitleCard = ({ data, handleContinueClick, isLastQuestion, previewMode }) => {
  const buttonText = isLastQuestion ? 'Next' : 'Continue';
  const disabled = previewMode && isLastQuestion;
  const disabledClass = disabled ? 'disabled' : '';
  return(
    <div className="landing-page">
      <div className="landing-page-html" dangerouslySetInnerHTML={{__html: data.content}} />
      <button className={`quill-button focus-on-light large primary contained ${disabledClass}`} disabled={disabled} onClick={handleContinueClick} type="button">
        {buttonText}
      </button>
    </div>
  );
}

export { PlayTitleCard };

