import React from 'react';
import moment from 'moment';
import "react-dates/initialize";
import * as _ from 'lodash'

import {
  formatDateTimeForDisplay,
  DatePickerContainer,
  DUE_DATE_DEFAULT_TEXT,
  PUBLISH_DATE_DEFAULT_TEXT,
  INVALID_DATES_SNACKBAR_COPY,
} from '../../../../helpers/unitActivityDates'
import {
  DataTable,
  Tooltip,
  getIconForActivityClassification,
  Snackbar,
  defaultSnackbarTimeout,
} from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request';
import PreviouslyAssignedTooltip from '../../previouslyAssignedTooltip';

const PUBLISH_DATE_ATTRIBUTE_KEY = 'publishDates'
const DUE_DATE_ATTRIBUTE_KEY = 'dueDates'

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
        tooltipTriggerText={<span className="publish-date-header">Publish date</span>}
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
  },
  {
    name: 'Previously assigned',
    attribute: 'previouslyAssigned',
    width: '60px',
    rowSectionClassName: rowSectionTooltipClassName
  },
]

export default class ReviewActivities extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      snackbarVisible: false,
      erroredActivityIds: [],
      previouslyAssignedActivityData: null
    }
  }

  componentDidUpdate() {
    const { activities } = this.props
    const { previouslyAssignedActivityData } = this.state
    if(!previouslyAssignedActivityData && activities) {
      this.getPreviouslyAssignedActivityData()
    }
  }

  getPreviouslyAssignedActivityData = () => {
    const { activities } = this.props
    const activityIds = JSON.stringify(activities.map(activity => activity.id))
    requestGet(`${process.env.DEFAULT_URL}/teachers/unit_templates/previously_assigned_activities?activity_ids=${activityIds}`, (response) => {
      if(response.previously_assigned_activity_data && Object.keys(response.previously_assigned_activity_data).length) {
        const { previously_assigned_activity_data } = response
        this.setState({ previouslyAssignedActivityData: previously_assigned_activity_data })
      }
    })
  }

  handleDateChange = (date, id, dateAttributeKey) => {
    const { activities, assignActivityDate, } = this.props
    const dates = this.props[dateAttributeKey]
    const activity = activities.find(act => act.id === id)
    const formattedDate = date || null
    this.setState({ erroredActivityIds: [], })
    assignActivityDate(activity, formattedDate, dateAttributeKey);
  }

  triggerSnackbar() {
    this.setState({ snackbarVisible: true }, () => {
      setTimeout(() => this.setState({ snackbarVisible: false, }), defaultSnackbarTimeout)
    })
  }

  handleDueDateChange = (date, id) => {
    const { activities, publishDates, } = this.props
    const dueDateIsBeforePublishDate = date && publishDates[id] && date <= moment.utc(publishDates[id])
    if (dueDateIsBeforePublishDate) {
      this.setState({
        erroredActivityIds: [id]
      }, this.triggerSnackbar)
    } else {
      this.handleDateChange(date, id, DUE_DATE_ATTRIBUTE_KEY)
    }
  }

  handlePublishDateChange = (date, id) => {
    const { activities, dueDates, } = this.props
    const publishDateIsAfterDueDate = date && dueDates[id] && date > moment.utc(dueDates[id])
    if (publishDateIsAfterDueDate) {
      this.setState({
        erroredActivityIds: [id]
      }, this.triggerSnackbar)
    } else {
      this.handleDateChange(date, id, PUBLISH_DATE_ATTRIBUTE_KEY)
    }
  }

  copyPublishDateToAll = () => {
    const { publishDates, dueDates, activities, } = this.props
    const publishDate = publishDates[activities[0].id]
    const activitiesWithEarlierDueDates = activities.filter(act => dueDates[act.id] && (publishDate >= dueDates[act.id]))

    if (publishDate && activitiesWithEarlierDueDates.length) {
      this.setState({
        erroredActivityIds: activitiesWithEarlierDueDates.map(a => a.id)
      }, this.triggerSnackbar)
    } else {
      this.copyDateToAll(PUBLISH_DATE_ATTRIBUTE_KEY)
    }
  }

  copyDueDateToAll = () => {
    const { publishDates, dueDates, activities, } = this.props
    const dueDate = dueDates[activities[0].id]
    const activitiesWithEarlierDueDates = activities.filter(act => publishDates[act.id] && (dueDate < publishDates[act.id]))

    if (dueDate && activitiesWithEarlierDueDates.length) {
      this.setState({
        erroredActivityIds: activitiesWithEarlierDueDates.map(a => a.id)
      }, this.triggerSnackbar)
    } else {
      this.copyDateToAll(DUE_DATE_ATTRIBUTE_KEY)
    }
  }

  copyDateToAll = (dateAttributeKey) => {
    const { activities, assignActivityDate, } = this.props
    const dates = this.props[dateAttributeKey]
    const existingDate = dates[activities[0].id] ? moment.utc(dates[activities[0].id]) : null
    this.setState({ erroredActivityIds: [], })
    activities.forEach(a => assignActivityDate(a, existingDate, dateAttributeKey))
  }

  removeRow = id => {
    const { activities, toggleActivitySelection } = this.props
    const activity = activities.find(act => act.id === id)
    toggleActivitySelection(activity, false)
  };

  rows() {
    const { activities, dueDates, publishDates, } = this.props
    const { erroredActivityIds, previouslyAssignedActivityData } = this.state

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
      const showCopyToAll = i === 0 && activities.length > 1

      const dueDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => this.handleDueDateChange(date, id)}
          defaultText={DUE_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={this.copyDueDateToAll}
          initialValue={dueDateInMoment}
          key={dueDateInMoment ? formatDateTimeForDisplay(dueDateInMoment) : id}
          showCopyToAll={showCopyToAll}
        />
      )

      const publishDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => this.handlePublishDateChange(date, id)}
          defaultText={PUBLISH_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={this.copyPublishDateToAll}
          initialValue={publishDateInMoment}
          key={publishDateInMoment ? formatDateTimeForDisplay(publishDateInMoment) : id}
          showCopyToAll={showCopyToAll}
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

      const className = erroredActivityIds.includes(activity.id) ? 'checked' : ''
      const data = previouslyAssignedActivityData && previouslyAssignedActivityData[id] ? previouslyAssignedActivityData[id] : null

      return {
        id,
        className,
        tool: toolIcon,
        activity: activityName,
        concept: activity_category.name,
        dueDatePicker,
        publishDatePicker,
        previouslyAssigned: <PreviouslyAssignedTooltip previouslyAssignedActivityData={data} />,
        removable: true
      }
    })
  }

  render() {
    const { snackbarVisible, } = this.state
    return (
      <div className="assignment-section review-activities-section">
        <Snackbar text={INVALID_DATES_SNACKBAR_COPY} visible={snackbarVisible} />
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
