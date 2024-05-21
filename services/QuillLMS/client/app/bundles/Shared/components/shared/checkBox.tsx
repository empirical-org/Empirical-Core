import * as React from 'react';
import { ACTIVE, DISABLED, INDETERMINATE } from '../../utils/constants';

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const smallBlackCheckSrc = 'https://assets.quill.org/images/icons/xs/check-small.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/icons/xs/check-small-white.svg'

interface checkboxProps {
  label: string;
  mode?: string;
  onClick?: () => void;
  state?: string;
  selected: boolean;
}

export const Checkbox = ({ label, mode='light', onClick, state, selected }: checkboxProps) => {
  const labelClass = `${state === DISABLED ? DISABLED : ''} ${mode}`

  function renderCheck() {
    if(state === INDETERMINATE) { return <img alt="check" src={indeterminateSrc} /> }
    if(!selected) { return }
    return mode === 'dark' ? <img alt="check" src={smallBlackCheckSrc} /> : <img alt="check" src={smallWhiteCheckSrc} />
  }

  function renderCheckbox() {
    let checkbox = (<button className={`quill-checkbox unselected ${mode}`} onClick={onClick} role="checkbox" type="button">
     {renderCheck()}
    </button>)
    if (state === INDETERMINATE) {
      checkbox = (<button className={`quill-checkbox selected ${mode}`} onClick={onClick} role="checkbox" type="button">
        {renderCheck()}
      </button>)
    } else if (state === ACTIVE || selected) {
      checkbox = (<button className={`quill-checkbox selected ${mode}`} onClick={onClick} role="checkbox" type="button">
        {renderCheck()}
      </button>)
    } else if(state === DISABLED) {
      checkbox = (<button className={`quill-checkbox ${selected ? 'selected' : 'unselected'} ${mode} disabled`} role="checkbox" type="button">
        {renderCheck()}
      </button>)
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
