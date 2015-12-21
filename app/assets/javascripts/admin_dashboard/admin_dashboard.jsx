'use strict';
$(function () {
  var adminDashboard;
  adminDashboard = $('#admin-dashboard')[0];
  if (adminDashboard) {
    var props = {
      analytics: new EC.AnalyticsWrapper()
    };
    React.render(React.createElement(EC.AdminDashboard, props), adminDashboard);
  }
});

EC.AdminDashboard = React.createClass({
  propTypes: {
    analytics: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <EC.AdminDashboardHeader/>
    )
  }

})

