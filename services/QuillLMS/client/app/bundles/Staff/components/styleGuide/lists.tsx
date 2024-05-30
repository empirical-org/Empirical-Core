import * as React from 'react';
import _ from 'lodash';
import { ACTIVE, List, DEFAULT, HOVER} from '../../../Shared';

const PRIMARY = 'primary'
const SECONDARY = 'secondary'
const CHECKBOX = 'checkbox'
const LIST_ITEM = 'List Item'
const SECONDARY_TEXT = 'Secondary text'
const TEXT = 'Text'

const STYLES = [{ label: 'Text', value: PRIMARY }, {label: 'Text with Secondary Text', value: SECONDARY}, {label: 'Checkbox', value: CHECKBOX}]
const STATES = [DEFAULT, HOVER, ACTIVE]
const ITEMS = {
  [PRIMARY]: [LIST_ITEM, LIST_ITEM, LIST_ITEM],
  [SECONDARY]: [{ primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT }, { primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT }, { primaryText: LIST_ITEM, secondaryText: SECONDARY_TEXT }],
  [CHECKBOX]: [
    {
      label: "Text",
      selected: true
    },
    {
      label: "Text",
      selected: true
    },
    {
      label: "Text",
      selected: true
    }
  ]
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
                <List items={ITEMS[value]} style={value}/>
              </div>
            )
          })}
        </div>
        {/* <h4 className="style-guide-h4">States</h4>
        <div className="options-container">
          {STATES.map(state => {
            return (
              <div className="option-container">
                <p className="option-label">{_.capitalize(state)}</p>
                <Checkbox
                  label="Text"
                  onClick={() => { }}
                  selected={state === ACTIVE}
                  state={state}
                />
              </div>
            )
          })}
        </div> */}
      </div>
    </div>
  )
}

export default Lists
