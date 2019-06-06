'use strict'

 import React from 'react'
 import ReactTable from 'react-table'
 import $ from 'jquery';

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
  },

  redirectToActivity(activityId) {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  },

  tooltipTrigger(e, id) {
    e.stopPropagation();
    $(this[`activateTooltip${id}`]).tooltip('show');
  },

  tooltipTriggerStop(e, id) {
    e.stopPropagation();
    $(this[`activateTooltip${id}`]).tooltip('hide');
  },

  columnDefinitions() {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        width: 78,
        accessor: a => a,
        id: 'toolName',
        Cell: props => <a onClick={() => this.redirectToActivity(props.value.id)} className='row-link-disguise'><div className={`icon-${props.value.classification.id}-green-no-border activity-icon`}></div></a>
      },
      {
        Header: 'Activity',
        accessor: a => a,
        id: 'activityName',
        Cell: props => <a
          onClick={() => this.redirectToActivity(props.value.id)}
          className='row-link-disguise highlight-on-hover'
          target="_new"
          title={
            `<h1>${props.value.name}</h1>
              <p>Tool: ${props.value.classification.name}</p>
              <p>${props.value.section_name}</p>
              <p>${props.value.topic.name}</p>
              <p>${props.value.description}</p>`
          }
          ref={(node) => { this[`activateTooltip${props.value.id}`] = node } }
          data-html="true"
          data-toggle="tooltip"
          data-placement="top"
        >
          {props.value.name}
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
              this.tooltipTrigger(e, rowInfo.original.id)
            },
            onMouseLeave: (e, handleOriginal) => {
              if (handleOriginal) {
                handleOriginal()
              }
              this.tooltipTriggerStop(e, rowInfo.original.id)
            }
          }
        }
      }
      />
    )
  }
});
