import React from 'react';
import DatePicker from 'react-datepicker';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { DataTable } from 'quill-component-library/dist/componentLibrary'

const tableHeaders = [{
    name: 'Tool',
    attribute: 'tool',
    width: '24px'
  },
  {
    name: 'Activity',
    attribute: 'activity',
    width: '375px'
  },
  {
    name: 'Concept',
    attribute: 'concept',
    width: '238px'
  },
  {
    name: 'Due date (optional)',
    attribute: 'dueDate',
    width: '105px'
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
    const activity = activities.find(act => act.id === id)
    const formattedDate = `${date.year()}-${date.month() + 1}-${date.date() + 1}`;
    assignActivityDueDate(activity, formattedDate);
  }

  rows() {
    const { activities, dueDates, handleDueDateChange, } = this.props

    return activities.map((activity) => {
      const { name, activity_classification, section, description, id, } = activity
      const dueDate = <DatePicker selected={dueDates[id]} minDate={moment()} onChange={date => handleDueDateChange(id, date)} />
      const activityName = (<div>
        <span style={{ paddingLeft: '45px', }} className={activity_classification ? `icon-${activity_classification.id}-green-no-border` : ''}>
          <div className='activate-tooltip' data-tip={`<h1>${name}</h1><p>Tool: ${activity_classification.alias}</p><p>${section.name}</p><p>${description}</p>`}>
            <ReactTooltip html multiline className="react-tooltip-custom" type="light" effect="solid" />
          </div>
        </span>
        <span className="tooltip-trigger activity_name">{name}</span>
      </div>)

      return {
        tool: activity_classification.name,
        activity: activityName,
        concept: section.name,
        dueDate
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
