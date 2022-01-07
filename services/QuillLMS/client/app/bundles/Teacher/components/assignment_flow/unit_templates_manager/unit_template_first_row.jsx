import React from 'react'
import moment from 'moment'
import * as _ from 'lodash'

import CategoryLabel from '../category_label'
import { imageTagForClassification, } from '../assignmentFlowConstants'

const cutOffTimeForNew = moment().subtract('months', 1).unix()

export default class UnitTemplateFirstRow extends React.Component {
  getBackgroundColor() {
    const { data, } = this.props
    return data.type.primary_color;
  }

  newFlag() {
    const { data, } = this.props
    if (cutOffTimeForNew < data.created_at) {
      return <span className='new-flag category-label'>NEW</span>
    }
  }

  renderRecommendedBy() {
    const { data, } = this.props

    if (data.activities_recommended_by.length === 0) { return <span className='recommended-by' /> }

    const productionActivitiesRecommendedBy = data.activities_recommended_by.filter(act => act.flags.includes("production") && act.name.length)

    if (productionActivitiesRecommendedBy.length === 0) { return <span className='recommended-by' /> }

    const packNamesArray = productionActivitiesRecommendedBy.map(act => act.name)

    let packNamesString = packNamesArray[0]

    if (packNamesArray.length === 2) {
      packNamesString = packNamesArray.join(' and ')
    }

    if (packNamesArray.length > 2) {
      packNamesString = packNamesArray.concat(packNamesArray.splice(-2, 2).join(', and ')).join(', ');
    }

    return (<div className='recommended-by'>
      <i className="fas fa-asterisk" />
      <span>This pack is a recommended follow-up to {packNamesString}.</span>
    </div>)
  }

  renderToolNames() {
    const { data, } = this.props

    const toolClassifications = data.activities.map(act => act.classification)
    const toolRows = _.uniqWith(toolClassifications, _.isEqual).map(classification => {
      return (<span className="tool-row" key={classification.key}>
        {imageTagForClassification(classification.key)}
        <span>{classification.name}</span>
      </span>)
    });

    return (<div className="tool-names">
      <span>Contains activities from:</span>
      <p>
        {toolRows}
      </p>
    </div>)
  }

  render() {
    const { data, } = this.props
    return (
      <div className='first-row' style={{backgroundColor: this.getBackgroundColor()}}>
        <div className="name-and-label">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className='unit-template-type'>
              {data.type.name}
            </div>
            <CategoryLabel
              data={data.unit_template_category}
              extraClassName='float-right'
            />
          </div>
          <div>
            <div>
              <div className='unit-template-name'>
                {data.name}
                {this.newFlag()}
              </div>
            </div>
          </div>
        </div>
        {this.renderToolNames()}
        {this.renderRecommendedBy()}
      </div>
    );
  }

}
