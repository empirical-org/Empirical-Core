import React from 'react';
import _ from 'underscore';

import ActivitySearchSort from './activity_search_sort';

const ActivitySearchSorts = props => {
  const sorts = _.map(props.sorts, function (sort) {
    // only pass update sort if the object has a sort path -- otherwise it should not be sortable
    return <ActivitySearchSort data={sort} key={sort.alias} updateSort={sort.sortPath ? props.updateSort : null} />;
  }, this);

  return (
    <tr>
      {sorts}
    </tr>
  );
};

export default ActivitySearchSorts;
