'use strict'

import React from 'react'
import StatusBar from './StatusBar.jsx'
import IntroPage from './IntroPage'
import ClassroomPage from './ClassroomPage.jsx'
require('../../../../../assets/styles/app-variables.scss')

export default React.createClass({


  render: function() {
      return (
          <div id='diagnostic-planner-status-bar'>
              {this.props.children}
          </div>
      );
  }

});
