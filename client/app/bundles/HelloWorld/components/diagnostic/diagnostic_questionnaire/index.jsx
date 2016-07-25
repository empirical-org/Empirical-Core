'use strict'

import React from 'react'
import StatusBar from './StatusBar.jsx'
import IntroPage from './IntroPage'

export default React.createClass({

  getInitialState: function() {
    return {stage: 1}
  },

  content: function() {
    var content;
    switch (this.state.stage) {
      case 1:
        content = <IntroPage/>
        break;
    }
    return content
  },

  render: function() {
      return (
          <div id='diagnostic-planner'>
              <StatusBar/>
              {this.content()}
          </div>
      );
  }

});
