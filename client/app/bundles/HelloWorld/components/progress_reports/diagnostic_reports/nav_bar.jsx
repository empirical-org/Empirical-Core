'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'

export default React.createClass({



  render: function() {
    return (
      <div id='reports-navbar'>
        <h1>Quill Diagnostic</h1>
        <div className='nav-elements'>

        </div>
        {this.props.children}
      </div>
    );
   }
 });
