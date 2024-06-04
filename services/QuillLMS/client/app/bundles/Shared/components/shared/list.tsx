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
        {items.map(({ label, onClick }) => {
          if(onClick) {
            return(
              <li>
                <button className="interactive-wrapper" onClick={onClick} type="button">{label}</button>
              </li>
            )
          }
          return <li>{label}</li>
        })}
      </ul>
    )
  }
  if(style === SECONDARY) {
    return (
      <ul className="list quill-list double-line">
        {items.map(({ primaryText, secondaryText, onClick }) => {
          const innerElement = (
            <span className="text">
              <p className="primary-text">{primaryText}</p>
              <p className='secondary-text'>{secondaryText}</p>
            </span>
          )
          if(onClick) {
            return(
              <li>
                <button className="interactive-wrapper" onClick={onClick} type="button">{innerElement}</button>
              </li>
            )
          }
          return(
            <li>
              <span className="text">
                <p className="primary-text">{primaryText}</p>
                <p className='secondary-text'>{secondaryText}</p>
              </span>
            </li>
          )
        })}
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
              selected={selected}
              state={state}
            />
          </li>
        ))}
      </ul>
    )
  }
}

export default List
