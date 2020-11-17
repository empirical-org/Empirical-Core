import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReactTable from 'react-table'

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
        id: 'conceptName',
        Cell: props => <a className='row-link-disguise' onClick={() => this.redirectToActivity(props.value.id)} style={{color: 'black'}}><span>{props.value.standard.standard_category.name}</span></a>
      },
      {
        accessor: 'id',
        maxWidth: 150,
        textAlign: 'right',
        accessor: a => a,
        id: 'chevron',
        Cell: props => <a className='row-link-disguise' onClick={() => this.redirectToActivity(props.value.id)}>Preview<img className="chevron-right" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" /></a>,
      }
    ];
  };

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
      />
    )
  }
}
