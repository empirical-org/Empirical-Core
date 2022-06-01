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
        maxWidth: 78,
        accessor: a => a,
        id: 'toolName',
        Cell: ({row}) => <a className='row-link-disguise' onClick={() => redirectToActivity(row.original.id)}>{getIconForActivityClassification(row.original.classification.id)}</a>
      },
      {
        Header: 'Activity',
        accessor: a => a,
        width: 586,
        id: 'activityName',
        Cell: ({row}) => {
          const standardLevelName = row.original.standard_level_name ? `<br/><p>${row.original.standard_level_name}</p>` : ''
          const standardName = row.original.standard.name ? `<br/><p>${row.original.standard.name}</p>` : ''
          const readability = row.original.readability ? `<br/><p>Readability: ${row.original.readability}</p>` : ''
          const topic = row.original.level_zero_topic_name ? `<br/><p>Topic: ${row.original.level_zero_topic_name}</p>` : ''
          const tooltipTriggerElement = <button className="interactive-wrapper activity-name focus-on-light highlight-on-hover" onClick={() => redirectToActivity(row.original.id)}>{row.original.name}</button>
          const tooltipText = `<h5>${row.original.name}</h5><br/><p>Tool: ${row.original.classification.name}</p>${standardLevelName}${standardName}${readability}${topic}<br/><p>${row.original.description}</p>`
          return(
            <Tooltip
              tooltipText={tooltipText}
              tooltipTriggerText={tooltipTriggerElement}
            />
          );
        },
        style: { overflow: 'visible' }
      },
      {
        Header: 'Concept',
        accessor: a => a,
        maxWidth: 183,
        id: 'conceptName',
        Cell: ({row}) => renderTooltipRow(row),
        style: {overflow: 'visible'}
      },
      {
        accessor: 'id',
        maxWidth: 81,
        textAlign: 'right',
        id: 'chevron',
        Cell: ({row}) => <a className='row-link-disguise' onClick={() => redirectToActivity(row.original.id)}>Preview</a>,
        style: {marginLeft: '14px'}
      }
    ];
  };

  function renderTooltipRow(row) {
    const { original } = row;
    const { id, standard } = original;
    const { standard_category } = standard;
    const { name } = standard_category;
    const averageFontWidth = 9
    const headerWidthNumber = 183
    const rowDisplayText = name
    let style: React.CSSProperties = { width: `183px`, minWidth: `183px`, textAlign: `left` }
    const key = `${id}`
    const sectionClass = 'something-class'
    const sectionText = (<a className='row-link-disguise' onClick={() => redirectToActivity(id)} style={{color: 'black'}}><span>{name}</span></a>)
    if ((String(rowDisplayText).length * averageFontWidth) >= headerWidthNumber) {
      return (
        <Tooltip
          key={key}
          tooltipText={rowDisplayText}
          tooltipTriggerStyle={style}
          tooltipTriggerText={sectionText}
          tooltipTriggerTextClass={sectionClass}
          tooltipTriggerTextStyle={style}
        />
      )
    } else {
      return sectionText
    }
  }

  return (
    <ReactTable
      className='unit-template-profile-activities'
      columns={columnDefinitions()}
      data={activities}
      defaultPageSize={activities.length}
    />
  )
}

export default UnitTemplateProfileActivityTable;
