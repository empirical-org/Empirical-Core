import React from 'react';

import Cms from './Cms.jsx'

import ActivityClassification from '../components/activity_classifications/activity_classification.jsx'

export default class ActivityClassifications extends React.Component {
  constructor(props) {
    super(props)
  }

  resourceComponentGenerator(cmsComponent) {
    return (<ActivityClassification
      activityClassification={cmsComponent.state.resourceToEdit}
      returnToIndex={cmsComponent.returnToIndex}
    />)
  }

  render() {
    //
    return (
      <div className="cms-activity-classifications">
        <Cms
          resourceComponentGenerator={this.resourceComponentGenerator}
          resourceNamePlural='activity_classifications'
          resourceNameSingular='activity_classification'
        />
      </div>);
  }
}
