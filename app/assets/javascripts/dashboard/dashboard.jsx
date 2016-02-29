"use strict";
$(function() {
  var ele = $('#dashboard');
  if (ele.length > 0) {
    React.render(React.createElement(EC.Dashboard), ele[0]);
  }
});

EC.Dashboard = React.createClass({
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
        return (<EC.MyClasses classList={this.state.classrooms}/>);
      }
  },

  render: function() {
    return (
      <div>
        <EC.ClassOverview data={this.state.performanceQuery} premium={this.state.hasPremium}/>
        {this.hasClasses()}
        <EC.MyResources data={this.state}/>
        <EC.DashboardFooter/>
      </div>
    );
  }
});
