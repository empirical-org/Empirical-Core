import React from 'react';
import _ from 'underscore';
import Unit from './activities_unit';

export default React.createClass({

  render() {
    const units = _.map(this.props.data, function (data) {
      return (<Unit
        activityReport={this.props.activityReport}
        activityWithRecommendationsIds={this.props.activityWithRecommendationsIds}
        allowSorting={this.props.allowSorting}
        data={data}
        hideUnit={this.props.hideUnit}
        hideUnitActivity={this.props.hideUnitActivity}
        key={data.unitId}
        lesson={this.props.lesson}
        report={this.props.report}
        updateDueDate={this.props.updateDueDate}
        updateMultipleDueDates={this.props.updateMultipleDueDates}
      />);
    }, this);
    return (
      <span>{units}</span>
    );
  },

});
