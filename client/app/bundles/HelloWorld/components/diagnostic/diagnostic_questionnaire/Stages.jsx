'use strict'

import React from 'react'
import ClassroomPage from './ClassroomPage.jsx'
import IntroPage from './IntroPage.jsx'
import StatusBar from './StatusBar.jsx'
import ModalOverview from './ModalOverview.jsx'

export default React.createClass({

  stage: function(){
    let stage
    if (this.props.params.stage === '1'){
      stage = <ModalOverview/>
    } else if (this.props.params.stage === '3') {
      stage = <ClassroomPage/>
    } else {
      stage = <IntroPage/>
    }
    return stage
  },


  render: function() {
    return (
      <div>
        <StatusBar stage={Number(this.props.params.stage)}/>,
        <div className='diagnostic-planner-body'>
          {this.stage()}
       </div>
     </div>
    );
   }
 });
