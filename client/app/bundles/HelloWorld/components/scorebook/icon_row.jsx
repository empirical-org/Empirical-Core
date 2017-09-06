import _ from 'underscore';
import React from 'react';

import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';
export default React.createClass({
  render() {
    const row = _.map(this.props.data, function (ele) {
      return (
        <ActivityIconWithTooltip key={ele.id} data={ele} premium_state={this.props.premium_state} context={'scorebook'} />
      );
    }, this);
    return (
      <div className="icon-row">
        {row}
      </div>
    );
  },
});
