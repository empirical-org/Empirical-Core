import * as React from 'react';
import { DISABLED } from '../../utils/constants';

const LIGHT = 'light'

interface radioButtonProps {
  label: string;
  mode?: string;
  onClick?: () => void;
  state?: string;
  selected: boolean;
  value?: any;
}

export const RadioButton = ({ label, mode = LIGHT, onClick, state, selected, value }: radioButtonProps) => {
  const elementClass = `${state === DISABLED ? DISABLED : ''} ${mode === LIGHT ? `${mode} focus-on-light` : `${mode} focus-on-dark`}`

  return (
    <div className="quill-radio-button-container">
      <button aria-checked={selected} className={`quill-radio-button interactive-wrapper ${selected ? 'selected' : 'unselected'} ${elementClass}`} onClick={onClick} role="checkbox" type="button" value={value} >
        <div className="button-fill" />
      </button>
      <span className={elementClass}>{label}</span>
    </div>
  );
};

export default RadioButton
