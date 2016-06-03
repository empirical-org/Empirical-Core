'use strict';
EC.NewTeacher = React.createClass({
  propTypes: {
    analytics: React.PropTypes.object.isRequired,
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    stage: React.PropTypes.number.isRequired,
    update: React.PropTypes.func.isRequired,
    textInputGenerator: React.PropTypes.object.isRequired
  },

  render: function () {
    if (this.props.stage ===1) {
      return (
        <EC.BasicTeacherInfo textInputGenerator={this.props.textInputGenerator} signUp={this.props.signUp} update={this.props.update}/>
      )
    } else if (this.props.stage ===2) {
      return (
        <EC.UsK12View analytics={this.props.analytics}/>
      );
    }
  }
});
