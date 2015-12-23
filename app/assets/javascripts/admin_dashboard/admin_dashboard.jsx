'use strict';
$(function () {
  var adminDashboard;
  adminDashboard = $('#admin-dashboard')[0];
  if (adminDashboard) {
    var id = $(adminDashboard).data('id')
    var props = {
      analytics: new EC.AnalyticsWrapper(),
      id: id
    };
    React.render(React.createElement(EC.AdminDashboard, props), adminDashboard);
  }
});

EC.AdminDashboard = React.createClass({
  propTypes: {
    analytics: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      model: {}
    }
  },

  componentDidMount: function () {
    $.ajax({
      url: '/admins/' + this.props.id,
      success: this.receiveData
    })
  },

  receiveData: function (data) {
    this.setState({model: data})
  },

  render: function () {
    return (
      <div>
        <EC.AdminDashboardHeader/>
        <EC.AdminsTeachers data={this.state.model.teachers} />
      </div>

    )
  }

})

