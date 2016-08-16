'use strict'

import React from 'react'

export default React.createClass({

  stage: function(){
    let report;
    if (this.props.params.report === '1'){
      // stage = <ModalOverview/>
    } else if (this.props.params.stage === '3') {
      // stage = <ClassroomPage/>
    } else {
      // stage = <IntroPage/>
    }
    return report;
  },


  render: function() {
    return (
      <div>
        {this.report()}
      </div>
    );
   }
 });
