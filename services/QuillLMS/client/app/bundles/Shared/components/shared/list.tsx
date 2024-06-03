import * as React from 'react';
import Checkbox from './checkBox';

type StyleType = 'primary' | 'secondary' | 'checkbox'
interface ListProps {
  items: any,
  style: StyleType
}

const PRIMARY = 'primary'
const SECONDARY = 'secondary'
const CHECKBOX = 'checkbox'

export const List = ({ items, style }: ListProps) => {
  if(style === PRIMARY) {
    return(
      <ul className="list quill-list single-line">
        {items.map(({ label, onClick }) => (
          <li>
            <button className="interactive-wrapper" onClick={onClick}>{label}</button>
          </li>
        ))}
      </ul>
    )
  }
  if(style === SECONDARY) {
    return (
      <ul className="list quill-list double-line">
        {items.map(({ primaryText, secondaryText, onClick }) => (
          <li>
            <button className="interactive-wrapper" onClick={onClick}>
              <span className="text">
                <p className="primary-text">{primaryText}</p>
                <p className='secondary-text'>{secondaryText}</p>
              </span>
            </button>
          </li>
        ))}
      </ul>
    )
  }
  if(style === CHECKBOX) {
    return (
      <ul className="list quill-list single-line">
        {items.map(({ label, mode, onClick, state, selected }) => (
          <li>
            <Checkbox
              label={label}
              mode={mode}
              onClick={onClick}
              state={state}
              selected={selected}
            />
          </li>
        ))}
      </ul>
    )
  }
}

export default List
