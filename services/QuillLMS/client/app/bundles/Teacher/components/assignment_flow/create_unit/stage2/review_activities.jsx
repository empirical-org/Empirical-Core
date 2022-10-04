import React from 'react';
import moment from 'moment';
import "react-dates/initialize";

import {
  formatDateTimeForDisplay,
  DatePickerContainer,
  DUE_DATE_DEFAULT_TEXT,
  PUBLISH_DATE_DEFAULT_TEXT,
  INVALID_DATES_SNACKBAR_COPY,
} from '../../../../helpers/unitActivityDates'
import { DataTable, Tooltip, getIconForActivityClassification } from '../../../../../Shared/index'

const activityColumnMaxWidth = '322px';
const rowSectionTooltipClassName =  'tooltip-section review-activities-data-table-section';
const tableHeaders = [
  {
    name: 'Tool',
    attribute: 'tool',
    width: '30px',
    rowSectionClassName: rowSectionTooltipClassName
  },
  {
    name: 'Activity',
    attribute: 'activity',
    rowSectionClassName: rowSectionTooltipClassName,
    width: activityColumnMaxWidth
  },
  {
    name: 'Concept',
    attribute: 'concept',
    width: '166px'
  },
  {
    name: (
      <Tooltip
        tooltipText="When you schedule an activity, it is displayed in your dashboard, but it is hidden from a student until the publish date."
        tooltipTriggerText={<span className="publish-date-header">Publish date <span>(optional)</span></span>}
      />
    ),
    attribute: 'publishDatePicker',
    width: '123px',
    headerClassName: 'publish-date-header-container',
    rowSectionClassName: 'datetime-picker'
  },
  {
    name: (
      <Tooltip
        tooltipText="Display a due date to students for this activity. Students can still access an activity after the due date."
        tooltipTriggerText={<span className="due-date-header">Due date <span>(optional)</span></span>}
      />
    ),
    attribute: 'dueDatePicker',
    width: '123px',
    headerClassName: 'due-date-header-container',
    rowSectionClassName: 'datetime-picker'
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

  handleDateChange = (date, id, dateAttributeKey) => {
    const { activities, assignActivityDate, } = this.props
    const dates = this.props[dateAttributeKey]
    const activity = activities.find(act => act.id === id)
    const formattedDate = date ? date : null
    assignActivityDate(activity, formattedDate, dateAttributeKey);
  }

  copyPublishDateToAll = () => this.copyDateToAll('publishDates')

  copyDueDateToAll = () => this.copyDateToAll('dueDates')

  copyDateToAll = (dateAttributeKey) => {
    const { activities, assignActivityDate, } = this.props
    const dates = this.props[dateAttributeKey]
    const existingDate = dates[activities[0].id] ? moment.utc(dates[activities[0].id]) : null
    activities.forEach(a => assignActivityDate(a, existingDate, dateAttributeKey))
  }

  removeRow = id => {
    const { activities, toggleActivitySelection } = this.props
    const activity = activities.find(act => act.id === id)
    toggleActivitySelection(activity, false)
  };

  rows() {
    const { activities, dueDates, publishDates, } = this.props

    return activities.map((activity, i) => {
      const {
        name,
        activity_classification,
        standard_level,
        activity_category,
        description,
        id,
        readability_grade_level
      } = activity
      const dueDateInMoment = dueDates[id] ? moment.utc(dueDates[id]) : null
      const publishDateInMoment = publishDates[id] ? moment.utc(publishDates[id]) : null
      const focusedKey = `focused-${id}`
      const dropdownIconStyle = this.state[focusedKey] ? { transform: 'rotate(180deg)', } : null;

      const dueDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => this.handleDateChange(date, id, 'dueDates')}
          defaultText={DUE_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={this.copyDueDateToAll}
          initialValue={dueDateInMoment}
          key={dueDateInMoment ? formatDateTimeForDisplay(dueDateInMoment) : id}
          rowIndex={i}
        />
      )

      const publishDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => this.handleDateChange(date, id, 'publishDates')}
          defaultText={PUBLISH_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={this.copyPublishDateToAll}
          initialValue={publishDateInMoment}
          key={publishDateInMoment ? formatDateTimeForDisplay(publishDateInMoment) : id}
          rowIndex={i}
        />
      )

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
          tooltipTriggerTextStyle={{ maxWidth: activityColumnMaxWidth }}
        />
      );

      return {
        id,
        tool: toolIcon,
        activity: activityName,
        concept: activity_category.name,
        dueDatePicker,
        publishDatePicker,
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
