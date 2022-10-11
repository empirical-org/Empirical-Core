import * as React from 'react';

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
        accessor: 'id',
        maxWidth: 81,
        textAlign: 'right',
        id: 'chevron',
        Cell: ({row}) => {
          const tooltipTriggerElement = <button className='interactive-wrapper focus-on-light highlight-on-hover' onClick={() => redirectToActivity(row.original.id)}>Preview</button>
          return(
            <Tooltip
              tooltipText={row.original.tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
        style: {marginLeft: '14px'}
      }
    ];
  };

  const activitiesFormattedForTable = activities.map(a => {
    const formattedActivity = { ...a }
    const divider = "<div class='horizontal-divider'></div>"
    const standardLevelName = a.standard_level_name ? `${divider}<p>${a.standard_level_name}</p>` : ''
    const standardName = a.standard.name ? `${divider}<p>${a.standard.name}</p>` : ''
    const readability = a.readability ? `${divider}<p>Readability: ${a.readability}</p>` : ''
    const topic = a.topic_names ? `${divider}<p>Topics: ${a.topic_names}</p>` : ''
    const tooltipText = `<p>Tool: ${a.classification.name}</p>${standardLevelName}${standardName}${readability}${topic}<p>${a.description}</p>`
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
