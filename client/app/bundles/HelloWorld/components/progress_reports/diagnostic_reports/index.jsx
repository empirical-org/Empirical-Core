
'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import NavBar from './nav_bar.jsx'
// import StatusBar from './StatusBar.jsx'
// import IntroPage from './IntroPage'
// import ClassroomPage from './ClassroomPage.jsx'
// require('../../../../../assets/styles/app-variables.scss')

export default React.createClass({




  render: function() {
      return (
          <div id='diagnostic-planner-reports'>
            <NavBar>
              {this.props.children}
            </NavBar>
          </div>
      );
  }

});
