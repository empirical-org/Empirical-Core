'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import ClassroomDropdown from '../../general_components/dropdown_selectors/classroom_dropdown.jsx'

export default React.createClass({
  propTypes: {
    classrooms: React.PropTypes.array.isRequired
  },

  render: function() {
    console.log(this.props.classrooms)
    return (
      <div id='reports-navbar'>
        <h1>Quill Diagnostic</h1>
        <div className='nav-elements'>
          <ClassroomDropdown classrooms={this.props.classrooms || [{name: 'Please Add a Classroom', id: null}]}/>
        </div>
        {this.props.children}
      </div>
    );
   }
 });
