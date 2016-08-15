'use strict'
import React from 'react'
import $ from 'jquery'
import ClassOverview from '../components/dashboard/class_overview'
import MyClasses from '../components/dashboard/my_classes'
import MyResources from '../components/dashboard/my_resources'
import DashboardFooter from '../components/dashboard/dashboard_footer'

export default React.createClass({
  getInitialState: function() {
    return ({
      classrooms: null,
      hasPremium: null,
      performanceQuery: [{header: "Struggling Students", results: null},{header: "Difficult Concepts", results: null}]
    });
  },

  componentWillMount: function() {
    this.ajax = {}
    this.ajax.classRoomRequest = $.get('classroom_mini', function(result) {
      this.setState({classrooms: result.classes});
    }.bind(this));
    this.ajax.premiumRequest = $.get('premium', function(result) {
      this.setState({hasPremium: result.hasPremium});
    }.bind(this));
    this.ajax.performanceQuery = $.get('dashboard_query', function(result) {
      this.setState({performanceQuery: result.performanceQuery});
    }.bind(this));
  },

  componentWillUnmount: function() {
    let ajaxCalls = this.ajax
      for (let key in ajaxCalls) {
        if (ajaxCalls.hasOwnProperty(key)) {
          ajaxCalls[key].abort();
        }
      }
  },

  hasClasses: function() {
    if (this.state.classrooms) {
        return (<MyClasses classList={this.state.classrooms} user={JSON.parse(this.props.user)}/>);
      }
  },

  render: function() {
    return (
      <div id='dashboard'>
        <ClassOverview data={this.state.performanceQuery} premium={this.state.hasPremium}/>
        {this.hasClasses()}
        <MyResources data={this.state}/>
        <DashboardFooter/>
      </div>
    );
  }
});
