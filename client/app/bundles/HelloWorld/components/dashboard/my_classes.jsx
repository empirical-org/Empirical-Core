'use strict'

 import React from 'react'
 import _ from 'underscore'
 import ClassMini from './class_mini.jsx'
 import AddOrSyncClassroomsMini from './add_or_sync_classrooms_mini.jsx'

 export default  React.createClass({

  createMinis: function() {
    var classes = this.props.classList;
    var minis = _.map(classes, function(classObj) {
      return <ClassMini classObj={classObj} key={classObj.code}/>;
    });
    return minis;
  },


  render: function() {
    return (
      <div className='dashboard-section-container'>
        <h3 className='dashboard-header'>My Classes</h3>
        <div className='row'>
          {this.createMinis()}
           <AddOrSyncClassroomsMini user={this.props.user}/>
        </div>
      </div>
    );
  }

});
