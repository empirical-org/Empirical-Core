'use strict'

import React from 'react'
import { Router, Route, Link, hashHistory } from 'react-router'
import GenericReport from './generic_report.jsx'
import StudentReport from './student_report.jsx'
import ClassReport from './class_report.jsx'

export default React.createClass({

  getInitialState: function(){
    return({hasPremium: '',
            loading: true})
  },

  componentDidMount: function(){
    this.getPremiumState()
  },

  report: function(){
    let reportValue = this.props.params.report
    let report, nav;
    if (reportValue === 'student_report'){
        report = <StudentReport key='Report' params={this.props.location} premiumState={this.state.hasPremium} classroom={this.props.classroom}/>
    } else {
        report = <ClassReport key='Report' params={this.props.params} premiumState={this.state.hasPremium}/>
    //     }
    // } else if (reportValue === '3') {
    //   // report = <ClassroomPage/>
    // } else {
      // report = <GenericReport key='Report' premiumState={this.state.hasPremium}/>


    }
    return [nav, report];
  },

  getPremiumState:function(){
    let that = this;
    $.get('/teachers/classrooms/premium', function(data) {that.setState({hasPremium: data.hasPremium})});
  },




  render: function() {
    return (
      <div>
        {this.report()}
      </div>
    );
   }
 });
