import React from 'react';
import moment from 'moment';
import "react-dates/initialize";

import { SingleDatePicker } from 'react-dates'
import { DataTable, Tooltip, getIconForActivityClassification } from '../../../../../Shared/index'

const tableHeaders = [
  {
    name: 'Tool',
    attribute: 'tool',
    width: '30px',
    rowSectionClassName: 'tooltip-section review-activities-data-table-section'
  },
  {
    name: 'Activity',
    attribute: 'activity',
    rowSectionClassName: 'tooltip-section review-activities-data-table-section',
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
        readability_grade_level
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
      const toolName = activity_classification.alias;
      const toolDescription = activity_classification.description;
      const readabilityScore = readability_grade_level ? `<br/><p>Readability score: ${readability_grade_level}</p>` : '';
      const standardLevelName = standard_level.name ? `<br/><p>${standard_level.name}</p>` : '';
      const toolIconTooltipText = `<h5>${toolName}</h5><br/><p>${toolDescription}</p>`;
      const activityNameTooltipText = `<h5>${name}</h5><br/><p>Tool: ${toolName}</p>${readabilityScore}${standardLevelName}<br/><p>${description}</p>`;

      const toolIcon = (
        <Tooltip
          tooltipText={toolIconTooltipText}
          tooltipTriggerText={getIconForActivityClassification(activity_classification.id)}
        />
      );
      const activityName = (
        <Tooltip
          tooltipText={activityNameTooltipText}
          tooltipTriggerText={name}
          tooltipTriggerTextClass="clipped-content"
          tooltipTriggerTextStyle={{ maxWidth: '350px' }}
        />
      );

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
