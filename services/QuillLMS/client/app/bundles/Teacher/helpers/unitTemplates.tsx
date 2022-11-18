
import * as React from 'react';
import { renderToString } from 'react-dom/server'
import { Activity } from '../../../interfaces/activity';

import { Tooltip, getIconForActivityClassification, NOT_APPLICABLE, assignedBadgeIconWhite } from '../../Shared';

export const ALL_FLAGS = 'all flags';
export const ALL_DIAGNOSTICS = 'all diagnostics';
export const ARCHIVED_FLAG = 'archived';
export const NOT_ARCHIVED_FLAG = 'not archived';

const conceptMaxWidth = '152px';

export function sortUnitTemplates (list) {
  return list.sort((bp1, bp2) => {
    // Group archived activities at the bottom of the list (they automatically get a higher order number
    // than any unarchived activity)
    if (bp1.flag.toLowerCase() === ARCHIVED_FLAG && bp2.flag.toLowerCase() !== ARCHIVED_FLAG) {
      return 1
    } else if (bp2.flag.toLowerCase() === ARCHIVED_FLAG && bp1.flag.toLowerCase() !== ARCHIVED_FLAG) {
      return -1
    }
    return bp1.order_number - bp2.order_number
  })
}

export function orderedUnitTemplates({
  diagnostic,
  fetchedData,
  flag,
  searchByActivityPack,
  searchInput
}) {
  let filteredData = fetchedData
  if (flag === NOT_ARCHIVED_FLAG) {
    filteredData = fetchedData.filter(data => data.flag !== ARCHIVED_FLAG.toLowerCase())
  } else if (flag !== ALL_FLAGS) {
    filteredData = fetchedData.filter(data => data.flag === flag.toLowerCase())
  }

  if (searchInput !== '' && searchByActivityPack) {
    filteredData = filteredData.filter(activity => {
      const { name } = activity;
      return name.toLowerCase().includes(searchInput.toLowerCase());
    })
  }

  if (searchInput !== '' && !searchByActivityPack) {
    filteredData = filteredData.filter(value => {
      return (
        value.activities && value.activities.map(x => x.name || '').some(y => y.toLowerCase().includes(searchInput.toLowerCase()))
      );
    })
  }

  if (diagnostic !== ALL_DIAGNOSTICS) {
    filteredData = filteredData.filter(value => {
      return (
        value.diagnostic_names && value.diagnostic_names.some(y => y.toLowerCase().includes(diagnostic.toLowerCase()))
      );
    })
  }

  return sortUnitTemplates(filteredData)
}

const conceptHeaderElement = (
  <Tooltip
    tooltipText="Activity Category"
    tooltipTriggerText={<a className="data-link focus-on-light" href={`${process.env.DEFAULT_URL}/cms/attributes_manager/activity_categories`} rel="noopener noreferrer" target="_blank">Concept</a>}
    tooltipTriggerTextStyle={{ maxWidth: conceptMaxWidth }}
  />
);

export const unitTemplateDataTableFields = [
  { name: "", attribute:"addActivity", width: "32px", noTooltip: true },
  { name: "Name", attribute:"name", width: "208px", rowSectionClassName: 'tabbable-field', noTooltip: true },
  { name: "Description", attribute:"description", width: "232px", rowSectionClassName: 'tooltip-section description-section', noTooltip: true },
  { name: "In packs", attribute:"inPacks", width: "232px", rowSectionClassName: 'in-packs-section', noTooltip: true },
  { name: "Flag", attribute:"flag", width: "80px", noTooltip: true },
  { name: "Readability", attribute:"readability", width: "64px", noTooltip: true },
  { name: conceptHeaderElement, attribute:"concept", width: conceptMaxWidth, noTooltip: true },
  { name: "Tool", attribute:"tool", width: "88px", noTooltip: true },
  { name: "", attribute:"edit", width: "88px", rowSectionClassName: 'tabbable-field', noTooltip: true }
];

export function displayInPacksInfo(unitTemplates) {
  return unitTemplates.map(unitTemplate => {
    const { id, name } = unitTemplate;
    return <a className="data-link focus-on-light" href={editActivityPackLink(id)} rel="noopener noreferrer" target="_blank">{name}</a>;
  });
}

export function unitTemplateActivityRows({ activities, handleClick, type }) {
  return activities.map(activity => {
    const { id, name, flags, activity_category, classification, readability_grade_level, description, unit_templates } = activity;
    const buttonStyle = type === 'add' ? 'add-activity-button' : 'remove-activity-button'
    const buttonText = type === 'add' ? '+' : '-'
    return {
      id,
      addActivity: <button className={`${buttonStyle} interactive-wrapper focus-on-light`} onClick={() => handleClick(activity)}>{buttonText}</button>,
      name: <a className="data-link focus-on-light" href={previewActivityLink(id)} rel="noopener noreferrer" target="_blank">{name}</a>,
      description: description || NOT_APPLICABLE,
      inPacks: displayInPacksInfo(unit_templates),
      flag: flags && flags.length ? flags.join(', ') : NOT_APPLICABLE,
      readability: readability_grade_level || NOT_APPLICABLE,
      concept: activity_category && activity_category.name ? activity_category.name : NOT_APPLICABLE,
      tool: classification && classification.id ? getIconForActivityClassification(classification.id) : NOT_APPLICABLE,
      edit: classification && classification.id ? <a className="data-link focus-on-light" href={editActivityLink(classification.id, id)} rel="noopener noreferrer" target="_blank">edit</a> : NOT_APPLICABLE
    }
  });
}

export const editActivityLink = (classificationId, activityId) => `${process.env.DEFAULT_URL}/cms/activity_classifications/${classificationId}/activities/${activityId}/edit`;

export const editActivityPackLink = (unitTemplateId) => `${process.env.DEFAULT_URL}/cms/unit_templates/${unitTemplateId}/edit`;

export const previewActivityLink = (activityId) => `${process.env.DEFAULT_URL}/activity_sessions/anonymous?activity_id=${activityId}`;

export const validateUnitTemplateForm = ({ activityPackFlag, activityPackName, activityPackType }) => {
  const errors = {};
  if(!activityPackFlag) {
    errors['activityPackFlag'] = 'Activity pack flag is required.'
  }
  if(!activityPackName) {
    errors['activityPackName'] = 'Activity pack name is required.'
  }
  if(!activityPackType) {
    errors['activityPackType'] = 'Activity pack type is required.'
  }
  return errors;
}

export const renderActivityPackTooltipElement = (data) => {
  if (!data) { return }
  const { activities } = data;
  const table = (
    <table className="activity-tooltip-table">
      <tbody>
        <tr>
          <th>Activity</th>
          <th>Tool</th>
          <th>Grade Level Range</th>
        </tr>
        {activities && activities.length && activities.map((activity: Activity) => {
          const { name, readability, classification } = activity
          return(
            <tr>
              <td>{name}</td>
              <td>{classification.name}</td>
              <td>{readability}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  return renderToString(table)
}

export const renderPreviouslyAssignedActivitiesTooltipElement = (data) => {
  if (!data) { return }

  const table = (
    <table className="previously-assigned-activities-table">
      <section className="assigned-activity-info-section">
        <img alt={assignedBadgeIconWhite.alt} src={assignedBadgeIconWhite.src} />
        <section className="assigned-activity-text-section">
          <p>You've previously assigned this activity in another activity pack. You can remove individual activities from a pre-created pack on the next page.</p>
          <br/>
          <p>Tip: If you want to add individual students to a previously created Activity Pack, go to "My Activities" to add students.</p>
        </section>
      </section>
      <tbody>
        <tr>
          <th>Assigned in Other Activity Packs</th>
          <th>Date Assigned</th>
          <th>Classes</th>
          <th>Students</th>
        </tr>
        {data.length && data.map((unit) => {
          const { name, assigned_date, classrooms, students } = unit;
          return(
            <tr>
              <td>{name}</td>
              <td>{assigned_date}</td>
              <td>{classrooms.map(classroom => (<p>{classroom}</p>))}</td>
              <td>
                {students.map(student => {
                  const { assigned_students, total_students } = student;
                  return <p>{`${assigned_students}/${total_students}`}</p>
                })}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
  return renderToString(table)
}
