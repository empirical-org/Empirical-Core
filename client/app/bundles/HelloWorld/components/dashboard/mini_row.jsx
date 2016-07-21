'use strict'

 import React from 'react'
 import _ from 'underscore'
 import 'ClassMini' from './class_mini'

 export default React.createClass({


  createMinis: function() {
    var minis = _.map(classes, function(classObj) {
      return <ClassMini classObj={classObj}/>;
    });
    return minis;
  },


  render: function() {
    return (
      <div className="row">
        {this.createMinis()}
      </div>
    );
  }
});
