import * as _ from 'lodash'
import moment from 'moment'
import React from 'react'

import { hexToRGBA } from '../../../../Shared'
import { imageTagForClassification, READING_TEXTS } from '../assignmentFlowConstants'
import CategoryLabel from '../category_label'

const cutOffTimeForNew = moment().subtract(1, 'months').unix()
const DEFAULT_ACTIVITY_PACK_IMAGE_LINKS = {
  'Default': 'https://s3.amazonaws.com/quill-image-uploads/uploads/files/Writing_1_2379.jpg',
  'Diagnostic': 'https://s3.amazonaws.com/quill-image-uploads/uploads/files/Chart_2380.jpg',
  'Whole Class Lessons': 'https://s3.amazonaws.com/quill-image-uploads/uploads/files/Class_2381.jpg'
}

export class UnitTemplateFirstRow extends React.Component {

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

  renderActivityPackImage(data) {
    if(!data) { return }

    const { image_link, type, unit_template_category } = data
    const { name } = unit_template_category
    const link = image_link || DEFAULT_ACTIVITY_PACK_IMAGE_LINKS[name] || DEFAULT_ACTIVITY_PACK_IMAGE_LINKS['Default']
    const color = unit_template_category.primary_color || type.primary_color
    const opaqueColor = hexToRGBA(color, 1)
    const translucentColor = hexToRGBA(color, 0.4)

    return(
      <div className="activity-pack-image-container" style={{ backgroundColor: color }}>
        <div className="activity-pack-image-overlay" style={{ backgroundImage: `linear-gradient(to right, ${opaqueColor},${translucentColor})`}} />
        <img alt="" className="activity-pack-image" loading="lazy" src={image_link || link} />
      </div>
    )
  }

  render() {
    const { data, } = this.props
    const { unit_template_category, type, name } = data
    const renderEvidenceTag = unit_template_category.name === READING_TEXTS
    const color = unit_template_category.primary_color || type.primary_color

    return (
      <div className='first-row' style={{ backgroundColor: color }}>
        {this.renderActivityPackImage(data)}
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

export default UnitTemplateFirstRow
