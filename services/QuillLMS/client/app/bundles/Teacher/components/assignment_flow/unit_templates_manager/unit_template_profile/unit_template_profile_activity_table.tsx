import * as React from 'react';
import ReactTooltip from 'react-tooltip'
import ReactTable from 'react-table'

import {Tooltip} from '../../../../../Shared/components/shared/tooltip'

export default class UnitTemplateProfileActivityTable extends React.Component {
  redirectToActivity = (activityId) => {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  };

  columnDefinitions = () => {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        width: 78,
        accessor: a => a,
        id: 'toolName',
        Cell: props => <a className='row-link-disguise' onClick={() => this.redirectToActivity(props.value.id)}><div className={`icon-${props.value.classification.id}-green-no-border activity-icon`} /></a>
      },
      {
        Header: 'Activity',
        accessor: a => a,
        width: 586,
        id: 'activityName',
        Cell: props => (<a
          className='row-link-disguise highlight-on-hover'
          data-tip={
            `<h1>${props.value.name}</h1>
              <p>Tool: ${props.value.classification.name}</p>
              <p>${props.value.standard_level_name}</p>
              <p>${props.value.standard.name}</p>
              <p>${props.value.description}</p>`
          }
          onClick={() => this.redirectToActivity(props.value.id)}
          target="_new"
        >
          {props.value.name}
          <ReactTooltip className="react-tooltip-custom" effect="solid" html multiline type="light" />
        </a>),
      },
      {
        Header: 'Concept',
        accessor: a => a,
        width: 183,
        id: 'conceptName',
        Cell: props => this.renderTooltipRow(props),
        style: {overflow: 'visible'}
      },
      {
        accessor: 'id',
        maxWidth: 81,
        textAlign: 'right',
        accessor: a => a,
        id: 'chevron',
        Cell: props => <a className='row-link-disguise' onClick={() => this.redirectToActivity(props.value.id)}>Preview</a>,
        style: {marginLeft: '14px'}
      }
    ];
  };

  renderTooltipRow(props) {
    const averageFontWidth = 9
    const headerWidthNumber = 183
    const rowDisplayText = props.value.standard.standard_category.name
    let style: React.CSSProperties = { width: `183px`, minWidth: `183px`, textAlign: `left` as CSS.TextAlignProperty }
    const key = `${props.value.id}`
    const sectionClass = 'something-class'
    const sectionText = (<a className='row-link-disguise' onClick={() => this.redirectToActivity(props.value.id)} style={{color: 'black'}}><span>{props.value.standard.standard_category.name}</span></a>)
    if ((String(rowDisplayText).length * averageFontWidth) >= headerWidthNumber) {
      return (<Tooltip
        key={key}
        tooltipText={rowDisplayText}
        tooltipTriggerStyle={style}
        tooltipTriggerText={sectionText}
        tooltipTriggerTextClass={sectionClass}
        tooltipTriggerTextStyle={style}
      />)
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
        showPagination={false}
        sortable={false}
        style={{overflow: 'visible'}}
      />
    )
  }
}
