'use strict'

 import React from 'react'
 import ReactTable from 'react-table'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
  },

  columnDefinitions: function() {
    // Student, Date, Activity, Score, Standard, Tool
    return [
      {
        Header: 'Tool',
        maxWidth: 160,
        accessor: 'classification.id',
        Cell: props => <div className={`icon-${props.value}-green-no-border activity-icon`}></div>
      },
      {
        Header: 'Activity',
        id: 'activityName',
        accessor: a => a,
        Cell: props => <a href={`/activity_sessions/anonymous?activity_id=${props.value.id}`} target="_blank" className='highlight-on-hover'>{props.value.name}</a>,
      },
      {
        Header: 'Concept',
        accessor: 'topic.topic_category.name',
        Cell: props => <span>{props.value}</span>,
      },
      {
        accessor: 'id',
        maxWidth: 150,
        textAlign: 'right',
        Cell: props =>  <a href={`/activity_sessions/anonymous?activity_id=${props.value}`} target="_blank" >Preview<img className="chevron-right" src="https://assets.quill.org/images/icons/chevron-dark-green.svg"/></a>,
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
        />
    )
  }
});
