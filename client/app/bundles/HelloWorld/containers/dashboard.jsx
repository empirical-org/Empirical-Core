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
    this.classRoomRequest = $.get('classroom_mini', function(result) {
      this.setState({classrooms: result.classes});
    }.bind(this));
    this.premiumRequest = $.get('premium', function(result) {
      this.setState({hasPremium: result.hasPremium});
    }.bind(this));
    this.performanceQuery = $.get('dashboard_query', function(result) {
      this.setState({performanceQuery: result.performanceQuery});
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.classRoomRequest.abort();
    this.premiumRequest.abort();
    this.performanceQuery.abort();
  },

  hasClasses: function() {
    if (this.state.classrooms) {
        return (<MyClasses classList={this.state.classrooms}/>);
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
