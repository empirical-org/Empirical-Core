import * as React from 'react';
import ReactTooltip from 'react-tooltip'

import { Tooltip, ReactTable, } from '../../../../../Shared/index'

export default class UnitTemplateProfileActivityTable extends React.Component {
  redirectToActivity = (activityId) => {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  };

  columnDefinitions = () => {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        maxWidth: 78,
        accessor: a => a,
        id: 'toolName',
        Cell: ({row}) => <a className='row-link-disguise' onClick={() => this.redirectToActivity(row.original.id)}><div className={`icon-${row.original.classification.id}-green-no-border activity-icon`} /></a>
      },
      {
        Header: 'Activity',
        accessor: a => a,
        width: 586,
        id: 'activityName',
        Cell: ({row}) => {
          const standardLevelName = row.original.standard_level_name ? `<p>${row.original.standard_level_name}</p>` : ''
          const standardName = row.original.standard.name ? `<p>${row.original.standard.name}</p>` : ''
          const readability = row.original.readability ? `<p>Readability: ${row.original.readability}</p>` : ''
          const topic = row.original.level_zero_topic_name ? `<p>Topic: ${row.original.level_zero_topic_name}</p>` : ''
          return (
            <a
              className='row-link-disguise highlight-on-hover'
              data-tip={
                `<h1>${row.original.name}</h1>
                <p>Tool: ${row.original.classification.name}</p>
                ${standardLevelName}
                ${standardName}
                ${readability}
                ${topic}
                <p>${row.original.description}</p>`
              }
              onClick={() => this.redirectToActivity(row.original.id)}
              target="_new"
            >
              {row.original.name}
              <ReactTooltip className="react-tooltip-custom" effect="solid" html multiline type="light" />
            </a>
          )
        },
      },
      {
        Header: 'Concept',
        accessor: a => a,
        maxWidth: 183,
        id: 'conceptName',
        Cell: ({row}) => this.renderTooltipRow(row),
        style: {overflow: 'visible'}
      },
      {
        accessor: 'id',
        maxWidth: 81,
        textAlign: 'right',
        id: 'chevron',
        Cell: ({row}) => <a className='row-link-disguise' onClick={() => this.redirectToActivity(row.original.id)}>Preview</a>,
        style: {marginLeft: '14px'}
      }
    ];
  };

  renderTooltipRow(row) {
    const averageFontWidth = 9
    const headerWidthNumber = 183
    const rowDisplayText = row.original.standard.standard_category.name
    let style: React.CSSProperties = { width: `183px`, minWidth: `183px`, textAlign: `left` as CSS.TextAlignProperty }
    const key = `${row.original.id}`
    const sectionClass = 'something-class'
    const sectionText = (<a className='row-link-disguise' onClick={() => this.redirectToActivity(row.original.id)} style={{color: 'black'}}><span>{row.original.standard.standard_category.name}</span></a>)
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

  render() {
    return (
      <ReactTable
        className='unit-template-profile-activities'
        columns={this.columnDefinitions()}
        data={this.props.data.activities}
        defaultPageSize={this.props.data.activities.length}
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onMouseEnter: (e, handleOriginal) => {
              if (handleOriginal) {
                handleOriginal()
              }
            },
            onMouseLeave: (e, handleOriginal) => {
              if (handleOriginal) {
                handleOriginal()
              }
            }
          }
        }}
        resizable={false}
        sortable={false}
        style={{overflow: 'visible'}}
      />
    )
  }
}
