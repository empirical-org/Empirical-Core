'use strict'

import React from 'react'
import createReactClass from 'create-react-class'
import StatusBar from './StatusBar.jsx'
import IntroPage from './IntroPage'
import ClassroomPage from './ClassroomPage.jsx'
require('../../../../../assets/styles/app-variables.scss')

export default createReactClass({


  render: function() {
      return (
          <div>
              {this.props.children}
          </div>
      );
  }

});
