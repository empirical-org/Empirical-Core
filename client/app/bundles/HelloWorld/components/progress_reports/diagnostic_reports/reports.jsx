'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import GenericReport from './generic_report.jsx'

export default React.createClass({

  report: function(){
    let reportValue = this.props.params.report
    let report
    if (reportValue === '1'){
      // report = <ModalOverview/>
    } else if (reportValue === '3') {
      // report = <ClassroomPage/>
    } else {
      report = <GenericReport/>
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
