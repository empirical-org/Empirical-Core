import React from 'react';
import _ from 'underscore';
import ActivitySearchSort from './activity_search_sort';

export default React.createClass({

  render() {
    const sorts = _.map(this.props.sorts, function (sort) {
      // only pass update sort if the object has a sort path -- otherwise it should not be sortable
      return <ActivitySearchSort key={sort.alias} updateSort={sort.sortPath ? this.props.updateSort : null} data={sort} />;
    }, this);

    return (
      <tr>
        {sorts}
      </tr>
    );
  },
});
