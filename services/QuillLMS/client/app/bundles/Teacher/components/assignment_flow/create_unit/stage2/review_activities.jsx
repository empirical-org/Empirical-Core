import React from 'react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import "react-dates/initialize";

import { SingleDatePicker } from 'react-dates'
import { DataTable } from '../../../../../Shared/index'

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
  }

  handleDueDateChange(id, date) {
    const { activities, assignActivityDueDate, dueDates, } = this.props
    const activity = activities.find(act => act.id === id)
    const existingDate = dueDates[id] ? moment(dueDates[id]) : null
    // if same date is selected twice, unselect it
    if (date && existingDate && existingDate.dayOfYear() === date.dayOfYear()) {
      assignActivityDueDate(activity, null)
    } else {
      const formattedDate = date ? `${date.year()}/${date.month() + 1}/${date.date()}` : null
      assignActivityDueDate(activity, formattedDate);
    }
  }

  removeRow = id => {
    const { activities, toggleActivitySelection } = this.props
    const activity = activities.find(act => act.id === id)
    toggleActivitySelection(activity, false)
  };

  rows() {
    const { activities, dueDates, } = this.props

    return activities.map((activity) => {
      const {
        name,
        activity_classification,
        standard_level,
        activity_category,
        description,
        id,
        anonymous_path
      } = activity
      const selectedDate = dueDates[id] ? moment(dueDates[id]) : null
      const focusedKey = `focused-${id}`
      const dropdownIconStyle = this.state[focusedKey] ? { transform: 'rotate(180deg)', } : null;

      const dueDate = (<SingleDatePicker
        customInputIcon={<img alt="dropdown indicator" src="https://assets.quill.org/images/icons/dropdown.svg" style={dropdownIconStyle} />} // momentPropTypes.momentObj or null
        date={selectedDate}
        focused={this.state[focusedKey]} // PropTypes.bool
        id={`${id}-date-picker`} // PropTypes.func.isRequired
        inputIconPosition="after" // PropTypes.string.isRequired,
        navNext="›"
        navPrev="‹"
        numberOfMonths={1}
        onDateChange={date => this.handleDueDateChange(id, date)}
        onFocusChange={({ focused, }) => this.setState({ [focusedKey]: focused })}
        placeholder="No due date"
      />)
      const toolTooltipId = `${id}-tool`
      const nameTooltipId = `${id}-name`
      const iconClassName = 'tooltip-trigger ' + activity_classification ? `icon-${activity_classification.id}-green-no-border` : ''
      const toolIcon = (<div className="activate-tooltip" data-for={toolTooltipId} data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${standard_level.name}</p><p>${description}</p>`}>
        <ReactTooltip className="react-tooltip-custom" effect="solid" html id={toolTooltipId} multiline type="light" />
        <span className={iconClassName} />
      </div>)
      const activityName = (<div>
        <div className="activate-tooltip" data-for={nameTooltipId} data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${standard_level.name}</p><p>${description}</p>`}>
          <ReactTooltip className="react-tooltip-custom" effect="solid" html id={nameTooltipId} multiline type="light" />
          <a className="tooltip-trigger activity-name" href={anonymous_path} rel='noreferrer noopener' target="_blank">{name}</a>
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
      <div className="assignment-section review-activities-section">
        <div className="assignment-section-header">
          <span className="assignment-section-number">2</span>
          <span className="assignment-section-name">Review activities and pick due dates</span>
        </div>
        <div className="assignment-section-body">
          <DataTable
            headers={tableHeaders}
            removeRow={this.removeRow}
            rows={this.rows()}
            showRemoveIcon
          />
        </div>
      </div>
    )
  }
}
