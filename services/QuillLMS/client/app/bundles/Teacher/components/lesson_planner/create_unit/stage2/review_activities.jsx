import React from 'react';
import DatePicker from 'react-datepicker';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
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
    width: '300px'
  },
  {
    name: 'Concept',
    attribute: 'concept',
    width: '200px'
  },
  {
    name: 'Due date (optional)',
    attribute: 'dueDate',
    width: '175px'
  }
]

export default class ReviewActivities extends React.Component {
  constructor(props) {
    super(props)
  }

  removeRow(id) {
    const { activities, toggleActivitySelection } = this.props
    const activity = activities.find(act => act.id === id)
    toggleActivitySelection(activity, false)
  }

  handleDueDateChange(id, date) {
    const { activities, assignActivityDueDate, } = this.props
    debugger;
    const activity = activities.find(act => act.id === id)
    const formattedDate = `${date.year()}-${date.month() + 1}-${date.date() + 1}`;
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
      const dueDate = (<DatePicker
        selected={selectedDate}
        minDate={moment()}
        onChange={date => this.handleDueDateChange(id, date)}
      />)
      const toolIcon = <span className={activity_classification ? `icon-${activity_classification.id}-green-no-border` : ''} />
      const activityName = (<div>
        <div className="activate-tooltip" data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${section.name}</p><p>${description}</p>`}>
          <ReactTooltip html multiline className="react-tooltip-custom" type="light" effect="solid" />
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
