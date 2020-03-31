import React from 'react'
import _ from 'underscore'
import ActivitySearchResult from './activity_search_result'

export default class ActivitySearchResults extends React.Component {
   render() {
     const rows = _.map(this.props.currentPageSearchResults, function (ele) {
         const selectedIds = _.pluck(this.props.selectedActivities, 'id')
         const selected = _.include(selectedIds, ele.id)
         return <ActivitySearchResult data={ele} key={ele.id} selected={selected} toggleActivitySelection={this.props.toggleActivitySelection} />
     }, this);
     return (
       <tbody>
         {rows}
       </tbody>
     );
   }
}
