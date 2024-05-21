import * as React from 'react';

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'

const INDETERMINATE = 'indeterminate'
const ACTIVE = 'active'
const DISABLED = 'disabled'

export const Checkbox = ({ label, state, selected, mode }) => {
  const labelClass = state === DISABLED ? 'disabled' : ''
  function renderCheckbox() {
    const selectedValue = selected ? 'selected' : 'unselected'
    let checkbox = <span className={`quill-checkbox ${selectedValue} ${mode}`} />
    if (state === INDETERMINATE) {
      checkbox = (<span className={`quill-checkbox selected ${mode}`}>
        <img alt="check" src={indeterminateSrc} />
      </span>)
    } else if (state === ACTIVE) {
      checkbox = (<span className={`quill-checkbox ${selectedValue} ${mode}`}>
        <img alt="check" src={smallWhiteCheckSrc} />
      </span>)
    } else if(state === DISABLED) {
      checkbox = <span className={`quill-checkbox ${selectedValue} ${mode} disabled`} />
    }
    return checkbox
  }

  return (
    <div className="checkbox-container">
      {renderCheckbox()}
      <span className={labelClass}>{label}</span>
    </div>
  );
};
