import React from 'react';
import AnalyticsWrapper from '../../../shared/analytics_wrapper';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      fastAssignDisabled: false,
    };
  },

  analytics() {
    return new AnalyticsWrapper();
  },

  propsSpecificComponent() {
    if (this.props.data.non_authenticated) {
      return <a href="/account/new"><button className="button-green full-width">Sign Up to Assign This Activity Pack</button></a>;
    }
  },

  render() {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className="fas fa-clock-o" />Estimated Time: {this.props.data.time} mins</p>
      </div>
    );
  },
});
