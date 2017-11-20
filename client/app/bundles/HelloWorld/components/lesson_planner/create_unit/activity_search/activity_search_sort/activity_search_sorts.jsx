import React from 'react';
import _ from 'underscore';
import ActivitySearchSort from './activity_search_sort';

export default React.createClass({

  render() {
    const sorts = _.map(this.props.sorts, function (sort) {
      return <ActivitySearchSort key={sort.alias} updateSort={this.props.updateSort} data={sort} />;
    }, this);

    return (
      <tr>
        <th className="scorebook-icon-check" />
        {sorts}
      </tr>
    );
  },
});
