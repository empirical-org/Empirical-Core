'use strict'

 import React from 'react'
 import AddClassMini from './add_class_mini.jsx'
 import ClassMini from './class_mini.jsx'
 import SyncGoogleClassroomsMini from './sync_google_classrooms_mini.jsx'

 export default  React.createClass({

  createMinis: function() {
    var classes = this.props.classList;
    var minis = _.map(classes, function(classObj) {
      return <ClassMini classObj={classObj} key={classObj.classroom.code}/>;
    });
    return minis;
  },

  googleTile: function(){
    if (this.props.user.signed_up_with_google) {
      return <SyncGoogleClassroomsMini/>
    }
  },

  render: function() {
    return (
      <div className='dashboard-section-container'>
        <h3 className='dashboard-header'>My Classes</h3>
        <div className='row'>
          {this.createMinis()}
          <AddClassMini/>
          {this.googleTile()}
        </div>
      </div>
    );
  }

});
