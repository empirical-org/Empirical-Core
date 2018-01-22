'use strict'

 import React from 'react'
 import ReactTable from 'react-table'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
  },

  redirectToActivity: function(activityId) {
    window.open(`/activity_sessions/anonymous?activity_id=${activityId}`, '_blank');
  },

  columnDefinitions: function() {
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
        Cell: props => <a onClick={() => this.redirectToActivity(props.value.id)} className='row-link-disguise highlight-on-hover'>{props.value.name}</a>,
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


  render: function () {
    return (
      <ReactTable
        data={this.props.data.activities}
        columns={this.columnDefinitions()}
        showPagination={false}
        defaultPageSize={this.props.data.activities.length}
        resizable={false}
        className='unit-template-profile-activities'
        sortable={false}
        />
    )
  }
});
