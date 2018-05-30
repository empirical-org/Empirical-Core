'use strict'

import React from 'react'
import ClassroomPage from './ClassroomPage.jsx'
import IntroPage from './IntroPage.jsx'
import StatusBar from './StatusBar.jsx'
import ModalOverview from './ModalOverview.jsx'

export default React.createClass({

  stage: function(){
    let stage, diagnosticName, diagnosticActivityId
    if (this.props.params.activityId == 447) {
      diagnosticName = 'ELL'
      diagnosticActivityId = 447
    } else if (this.props.params.activityId == 413) {
      diagnosticName = 'Sentence Structure'
      diagnosticActivityId = 413
    }
    if (this.props.params.stage === '1'){
      stage = <ModalOverview diagnosticName={diagnosticName} diagnosticActivityId={diagnosticActivityId}/>
    } else if (this.props.params.stage === '3') {
      stage = <ClassroomPage diagnosticName={diagnosticName} diagnosticActivityId={diagnosticActivityId}/>
    } else {
      stage = <IntroPage diagnosticName={diagnosticName} diagnosticActivityId={diagnosticActivityId}/>
    }
    return stage
  },


  render: function() {
    let topSection
    if (this.props.params.activityId == 413) {
      topSection = <StatusBar stage={Number(this.props.params.stage)}/>
    } else {
      topSection = <div style={{height: '20px'}}/>
    }
    return (
      <div id='diagnostic-planner-status-bar'>
        {topSection}
        <div className='diagnostic-planner-body'>
          {this.stage()}
       </div>
     </div>
    );
   }
 });
