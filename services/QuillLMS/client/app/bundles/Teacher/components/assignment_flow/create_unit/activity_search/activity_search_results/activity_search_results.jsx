import React from 'react'
import _ from 'underscore'

import ActivitySearchResult from './activity_search_result'

const ActivitySearchResults = (
  {
    currentPageSearchResults,
    selectedActivities,
    toggleActivitySelection,
  },
) => {
  const rows = _.map(currentPageSearchResults, function (ele) {
      const selectedIds = _.pluck(selectedActivities, 'id')
      const selected = _.include(selectedIds, ele.id)
      return <ActivitySearchResult data={ele} key={`${ele.id}-${ele.activity_category_id}`} selected={selected} toggleActivitySelection={toggleActivitySelection} />;
  }, this);
  return (
    <tbody>
      {rows}
    </tbody>
  );
};

export default ActivitySearchResults;
