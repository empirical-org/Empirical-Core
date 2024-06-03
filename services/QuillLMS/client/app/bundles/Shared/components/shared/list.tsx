import * as React from 'react';
import Checkbox from './checkBox';

type StyleType = 'primary' | 'secondary' | 'checkbox'
interface ListProps {
  items: any,
  style: StyleType
}

export const List = ({ items, style }: ListProps) => {
  if(style === 'primary') {
    return(
      <ul className="list quill-list single-line">
        {items.map(item => (
          <li className="focus-on-light" tabIndex={0}>{item}</li>
        ))}
      </ul>
    )
  }
  if(style === 'secondary') {
    return (
      <ul className="list quill-list double-line">
        {items.map(({ primaryText, secondaryText}) => (
          <li className="focus-on-light" tabIndex={0}>
            <span className="text">
              <p className="primary-text">{primaryText}</p>
              <p className='secondary-text'>{secondaryText}</p>
            </span>
          </li>
        ))}
      </ul>
    )
  }
  if(style === 'checkbox') {
    return (
      <ul className="list quill-list single-line">
        {items.map(({ label, mode, onClick, state, selected }) => (
          <li className="focus-on-light" tabIndex={0}>
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
