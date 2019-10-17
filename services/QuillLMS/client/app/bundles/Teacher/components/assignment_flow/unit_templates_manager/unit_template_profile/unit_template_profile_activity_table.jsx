'use strict'

 import React from 'react'
 import ReactTooltip from 'react-tooltip'
 import ReactTable from 'react-table'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
  },

  redirectToActivity(activityId) {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  },

  columnDefinitions() {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        width: 78,
        accessor: a => a,
        id: 'toolName',
        Cell: props => <a onClick={() => this.redirectToActivity(props.value.id)} className='row-link-disguise'><div className={`icon-${props.value.classification.id}-green-no-border activity-icon`} /></a>
      },
      {
        Header: 'Activity',
        accessor: a => a,
        id: 'activityName',
        Cell: props => <a
          onClick={() => this.redirectToActivity(props.value.id)}
          className='row-link-disguise highlight-on-hover'
          target="_new"
          data-tip={
            `<h1>${props.value.name}</h1>
              <p>Tool: ${props.value.classification.name}</p>
              <p>${props.value.section_name}</p>
              <p>${props.value.topic.name}</p>
              <p>${props.value.description}</p>`
          }
        >
          {props.value.name}
          <ReactTooltip html multiline className="react-tooltip-custom" type="light" effect="solid" />
        </a>,
      },
      {
        Header: 'Concept',
        accessor: a => a,
        id: 'conceptName',
        Cell: props => <a onClick={() => this.redirectToActivity(props.value.id)} className='row-link-disguise' style={{color: 'black'}}><span>{props.value.topic.topic_category.name}</span></a>
      },
      {
        accessor: 'id',
        maxWidth: 150,
        textAlign: 'right',
        accessor: a => a,
        id: 'chevron',
        Cell: props => <a onClick={() => this.redirectToActivity(props.value.id)} className='row-link-disguise'>Preview<img className="chevron-right" src="https://assets.quill.org/images/icons/chevron-dark-green.svg"/></a>,
      }
    ];
  },

  render() {
    return (
      <ReactTable
        data={this.props.data.activities}
        columns={this.columnDefinitions()}
        showPagination={false}
        defaultPageSize={this.props.data.activities.length}
        resizable={false}
        className='unit-template-profile-activities'
        sortable={false}
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
        }
      }
      />
    )
  }
});
