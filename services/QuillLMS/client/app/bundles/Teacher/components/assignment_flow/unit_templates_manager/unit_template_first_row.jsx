import React from 'react'
import moment from 'moment'
import * as _ from 'lodash'

import CategoryLabel from '../category_label'
import { imageTagForClassification, READING_TEXTS } from '../assignmentFlowConstants'
import { hexToRGBA } from '../../../../Shared'

const cutOffTimeForNew = moment().subtract('months', 1).unix()

export default class UnitTemplateFirstRow extends React.Component {

  renderFlag(renderEvidenceTag) {
    const { data, } = this.props
    if(renderEvidenceTag) {
      return <p className="new-beta-tag">BETA</p>
    }
    if (cutOffTimeForNew < data.created_at) {
      return <p className='new-beta-tag'>NEW</p>
    }
  }

  renderToolNames() {
    const { data, } = this.props

    const toolClassifications = data.activities.map(act => act.classification)
    const toolRows = _.uniqWith(toolClassifications, _.isEqual).map(classification => {
      return (
        <span className="tool-row" key={classification.key}>
          {imageTagForClassification(classification.key)}
          <span>{classification.name}</span>
        </span>
      )
    });

    return (
      <div className="tool-names">
        <span>Contains activities from</span>
        <p>
          {toolRows}
        </p>
      </div>
    )
  }

  renderImageOrDefaultColorPanel(data) {
    if(!data || !data.image_link) { return }

    const { image_link, type } = data
    const { unit_template_category } = data
    const color = unit_template_category.primary_color || type.primary_color
    const fullColor = hexToRGBA(color, 1)
    const translucentColor = hexToRGBA(color, 0.4)

    return(
      <div className="activity-pack-image-container" style={{ backgroundColor: color }}>
        <div className="activity-pack-image-overlay" style={{ backgroundImage: `linear-gradient(to right, ${fullColor},${translucentColor})`}} />
        <img className="activity-pack-image" src={image_link} />
      </div>
    )
  }

  render() {
    const { data, } = this.props
    const { unit_template_category, type, name, image_link } = data
    const renderEvidenceTag = unit_template_category.name === READING_TEXTS
    const color = unit_template_category.primary_color || type.primary_color
    const cardColorStyle = image_link ? {} : { backgroundColor: color }

    return (
      <div className='first-row' style={cardColorStyle}>
        {this.renderImageOrDefaultColorPanel(data)}
        <div className="content-section">
          <div className="name-and-label">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <CategoryLabel
                data={unit_template_category}
                extraClassName='float-right'
              />
              {renderEvidenceTag && <span className="evidence-new-tag">NEW</span>}
            </div>
            <div>
              <div>
                <div className='unit-template-name'>
                  {name}
                </div>
                {this.renderFlag(renderEvidenceTag)}
              </div>
            </div>
          </div>
          {this.renderToolNames()}
        </div>
      </div>
    );
  }

}
