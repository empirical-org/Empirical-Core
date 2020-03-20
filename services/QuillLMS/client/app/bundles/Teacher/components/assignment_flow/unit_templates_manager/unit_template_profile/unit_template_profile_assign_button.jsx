import PropTypes from 'prop-types';
import React from 'react';
import AnalyticsWrapper from '../../../shared/analytics_wrapper';

export default class extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  state = {
    fastAssignDisabled: false,
  };

  analytics = () => {
    return new AnalyticsWrapper();
  };

  propsSpecificComponent = () => {
    if (this.props.data.non_authenticated) {
      return <a href="/account/new"><button className="button-green full-width">Sign Up to Assign This Activity Pack</button></a>;
    }
  };

  render() {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className="far fa-clock" />Estimated Time: {this.props.data.time} mins</p>
      </div>
    );
  }
}
