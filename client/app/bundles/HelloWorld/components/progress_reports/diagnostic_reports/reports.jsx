'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import GenericReport from './generic_report.jsx'

export default React.createClass({

  getInitialState: function(){
    return({hasPremium: '',
            loading: true})
  },

  report: function(){
    let reportValue = this.props.params.report
    let report, nav;
    if (reportValue === '1'){
      // report = <ModalOverview/>
    } else if (reportValue === '3') {
      // report = <ClassroomPage/>
    } else {
      report = <GenericReport key='Report' premiumState={this.state.hasPremium}/>
    }
    return [nav, report];
  },

  getPremiumState:function(){
    let that = this;
    $.get('/teachers/classrooms/premium', function(data) {that.setState({hasPremium: data.hasPremium})});
  },

  componentDidMount: function(){
    this.getPremiumState()
  },


  render: function() {
    return (
      <div>
        {this.report()}
      </div>
    );
   }
 });
