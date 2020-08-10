import * as React from 'react';

const SubmitButton = ({ disabled, onClick, }: {disabled: Boolean, onClick: ((event: any) => void), }) => {
  const disabledClassName = disabled ? 'disabled' : ''
  return (
    <div className="question-button-group">
      <button className={`quill-button primary contained large focus-on-light ${disabledClassName}`} disabled={disabled} onClick={onClick} type="button">Submit</button>
    </div>
  );
}

export default SubmitButton;
