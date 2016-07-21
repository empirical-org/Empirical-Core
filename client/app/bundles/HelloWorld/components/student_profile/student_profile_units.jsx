'use strict';
import React from 'react'
import _ from 'underscore'
import StudentProfileUnit from './student_profile_unit.jsx'


export default React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    var units = _.reduce(this.props.data, function (acc, value, key) {
      var x = <StudentProfileUnit key={key} data={_.extend(value, {unitName: key})} />
      return _.chain(acc).push(x).value();
    }, []);
    return (
      <div className='container'>
        {units}
      </div>
    );
  }
});
