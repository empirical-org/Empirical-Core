import * as React from 'react';

import PreviouslyAssignedTooltip from '../../previouslyAssignedTooltip';
import { Tooltip, ReactTable, getIconForActivityClassification } from '../../../../../Shared/index'

export const UnitTemplateProfileActivityTable = ({ data }) => {
  const { activities } = data;

  function redirectToActivity(activityId) {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  };

  function columnDefinitions() {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        maxWidth: 50,
        accessor: a => a,
        id: 'toolName',
        Cell: ({row}) => {
          const tooltipTriggerElement = <button className='interactive-wrapper focus-on-light highlight-on-hover' onClick={() => redirectToActivity(row.original.id)}>{getIconForActivityClassification(row.original.classification.id)}</button>
          return(
            <Tooltip
              tooltipText={row.original.tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
      },
      {
        Header: 'Activity',
        accessor: a => a,
        maxWidth: 586,
        id: 'activityName',
        Cell: ({row}) => {
          const tooltipTriggerElement = <button className="interactive-wrapper activity-name focus-on-light highlight-on-hover" onClick={() => redirectToActivity(row.original.id)}>{row.original.name}</button>
          return(
            <Tooltip
              tooltipText={row.original.tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
      },
      {
        Header: 'Concept',
        accessor: a => a,
        maxWidth: 183,
        id: 'conceptName',
        Cell: ({row}) => {
          const { original } = row;
          const { id, standard } = original;
          const { standard_category } = standard;
          const { name } = standard_category;
          const tooltipTriggerElement = <button className='interactive-wrapper focus-on-light highlight-on-hover' onClick={() => redirectToActivity(id)}>{name}</button>
          return(
            <Tooltip
              tooltipText={row.original.tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
      },
      {
        Header: 'Previously assigned',
        accessor: a => a,
        maxWidth: 80,
        id: 'previouslyAssigned',
        Cell: ({row}) => {
          const { previously_assigned_activity_data } = data
          const { original } = row;
          const { id } = original;
          if(previously_assigned_activity_data[id]) {
            return(<PreviouslyAssignedTooltip previouslyAssignedActivityData={previously_assigned_activity_data[id]} />)
          }
          return <span />
        },
      },
      {
        accessor: 'id',
        maxWidth: 81,
        textAlign: 'right',
        id: 'chevron',
        Cell: ({row}) => {
          const tooltipTriggerElement = <button className='interactive-wrapper activity-preview focus-on-light highlight-on-hover' onClick={() => redirectToActivity(row.original.id)}>Preview</button>
          return(
            <Tooltip
              tooltipText={row.original.tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
      }
    ];
  };

  const activitiesFormattedForTable = activities.map(a => {
    const formattedActivity = { ...a }
    const divider = "<div class='horizontal-divider'></div>"
    const standardLevelName = a.standard_level_name ? `${divider}<p>${a.standard_level_name}</p>` : ''
    const standardName = a.standard.name ? `${divider}<p>${a.standard.name}</p>` : ''
    const readability = a.readability ? `${divider}<p>Readability: ${a.readability}</p>` : ''
    const topics = a.topic_names ? `${divider}<p>Topics: ${a.topic_names.join(', ')}</p>` : ''
    const tooltipText = `<p>Tool: ${a.classification.name}</p>${standardLevelName}${standardName}${readability}${topics}<p>${a.description}</p>`
    formattedActivity.tooltipText = tooltipText
    return formattedActivity
  })

  return (
    <ReactTable
      className='unit-template-profile-activities'
      columns={columnDefinitions()}
      data={activitiesFormattedForTable}
      defaultPageSize={activitiesFormattedForTable.length}
    />
  )
}

export default UnitTemplateProfileActivityTable;
