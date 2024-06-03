import * as React from 'react';
import _ from 'lodash';
import { ACTIVE, List, DEFAULT, HOVER} from '../../../Shared';

const PRIMARY = 'primary'
const SECONDARY = 'secondary'
const CHECKBOX = 'checkbox'
const LIST_ITEM = 'List Item'
const SECONDARY_TEXT = 'Secondary text'
const TEXT = 'Text'
const onClick = () => {}

const STYLES = [{ label: TEXT, value: PRIMARY }, {label: 'Text with Secondary Text', value: SECONDARY}, {label: 'Checkbox', value: CHECKBOX}]
const STATES = [DEFAULT, HOVER, ACTIVE]
const LIST_ITEMS = [{ label: LIST_ITEM, onClick: onClick }, { label: LIST_ITEM, onClick: onClick }, { label: LIST_ITEM, onClick: onClick }]
const CHECKBOX_ITEMS = [
  {
    label: TEXT,
    selected: true
  },
  {
    label: TEXT,
    selected: true
  },
  {
    label: TEXT,
    selected: true
  }
]
const STYLE_ITEMS = {
  [PRIMARY]: LIST_ITEMS,
  [SECONDARY]: [{ primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT, onClick: onClick }, { primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT, onClick: onClick }, { primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT, onClick: onClick }],
  [CHECKBOX]: CHECKBOX_ITEMS
}
const STATE_ITEMS = {
  [DEFAULT]: LIST_ITEMS,
  [HOVER]: LIST_ITEMS,
  [ACTIVE]: CHECKBOX_ITEMS
}

export const Lists = ({}) => {
  return (
    <div id="lists">
      <h2 className="style-guide-h2">Lists</h2>
      <div className="variations-container">
        <h4 className="style-guide-h4">Styles</h4>
        <div className="options-container">
          {STYLES.map(({ label, value })=> {
            return (
              <div className="option-container">
                <p className="option-label">{label}</p>
                <List items={STYLE_ITEMS[value]} style={value}/>
              </div>
            )
          })}
        </div>
        <h4 className="style-guide-h4">States</h4>
        <div className="options-container">
          {STATES.map((state, i) => {
            const listStyle = i === 2 ? CHECKBOX : PRIMARY
            return (
              <div className={`option-container ${state}`}>
                <p className="option-label">{_.capitalize(state)}</p>
                <List items={STATE_ITEMS[state]} style={listStyle} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Lists
