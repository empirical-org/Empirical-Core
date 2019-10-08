import React from 'react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import { SingleDatePicker } from 'react-dates'
import { DataTable } from 'quill-component-library/dist/componentLibrary'

const tableHeaders = [
  {
    name: 'Tool',
    attribute: 'tool',
    width: '30px',
    rowSectionClassName: 'tool-icon'
  },
  {
    name: 'Activity',
    attribute: 'activity',
    width: '350px'
  },
  {
    name: 'Concept',
    attribute: 'concept',
    width: '200px'
  },
  {
    name: 'Due date (optional)',
    attribute: 'dueDate',
    width: '150px',
    rowSectionClassName: 'due-date-picker'
  }
]

export default class ReviewActivities extends React.Component {
  constructor(props) {
    super(props)

    const state = {}
    props.activities.forEach(act => {
      state[`focused-${act.id}`] = false
    })

    this.state = state

    this.removeRow = this.removeRow.bind(this)
  }

  removeRow(id) {
    const { activities, toggleActivitySelection } = this.props
    const activity = activities.find(act => act.id === id)
    toggleActivitySelection(activity, false)
  }

  handleDueDateChange(id, date) {
    const { activities, assignActivityDueDate, } = this.props
    const activity = activities.find(act => act.id === id)
    const formattedDate = date ? `${date.year()}-${date.month() + 1}-${date.date()}` : null
    assignActivityDueDate(activity, formattedDate);
  }

  rows() {
    const { activities, dueDates, } = this.props

    return activities.map((activity) => {
      const {
        name,
        activity_classification,
        section,
        activity_category,
        description,
        id,
      } = activity
      const selectedDate = dueDates[id] ? moment(dueDates[id]) : null
      const focusedKey = `focused-${id}`
      const dropdownIconStyle = this.state[focusedKey] ? { transform: 'rotate(180deg)', } : null;

      const dueDate = (<SingleDatePicker
        date={selectedDate} // momentPropTypes.momentObj or null
        onDateChange={date => this.handleDueDateChange(id, date)}
        focused={this.state[focusedKey]} // PropTypes.bool
        onFocusChange={({ focused, }) => this.setState({ [focusedKey]: focused })} // PropTypes.func.isRequired
        id={`${id}-date-picker`} // PropTypes.string.isRequired,
        placeholder="No due date"
        numberOfMonths={1}
        navPrev={'‹'}
        navNext={'›'}
        customInputIcon={<img src="https://assets.quill.org/images/icons/dropdown.svg" alt="dropdown indicator" style={dropdownIconStyle} />}
        inputIconPosition="after"
      />)
      const toolTooltipId = `${id}-tool`
      const nameTooltipId = `${id}-name`
      const iconClassName = 'tooltip-trigger ' + activity_classification ? `icon-${activity_classification.id}-green-no-border` : ''
      const toolIcon = (<div className="activate-tooltip" data-for={toolTooltipId} data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${section.name}</p><p>${description}</p>`}>
        <ReactTooltip id={toolTooltipId} html multiline className="react-tooltip-custom" type="light" effect="solid" />
        <span className={iconClassName} />
      </div>)
      const activityName = (<div>
        <div className="activate-tooltip" data-for={nameTooltipId} data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${section.name}</p><p>${description}</p>`}>
          <ReactTooltip id={nameTooltipId} html multiline className="react-tooltip-custom" type="light" effect="solid" />
          <span className="tooltip-trigger activity-name">{name}</span>
        </div>
      </div>)

      return {
        id,
        tool: toolIcon,
        activity: activityName,
        concept: activity_category.name,
        dueDate,
        removable: true
      }
    })
  }

  render() {
    return (
      <div className="assignment-section">
        <div className="assignment-section-header">
          <span className="assignment-section-number">2</span>
          <span className="assignment-section-name">Review activities and pick due dates</span>
        </div>
        <div className="assignment-section-body">
          <DataTable
            headers={tableHeaders}
            rows={this.rows()}
            removeRow={this.removeRow}
            showRemoveIcon
          />
        </div>
      </div>
    )
  }
}
