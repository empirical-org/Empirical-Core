import React from 'react'
import moment from 'moment'

import CategoryLabel from '../../../category_labels/category_label'

const cutOffTimeForNew = moment().subtract('months', 1).unix()

export default class UnitTemplateFirstRow extends React.Component {
  getBackgroundColor() {
    return this.props.data.type.primary_color;
  }

  newFlag() {
    if (cutOffTimeForNew < this.props.data.created_at) {
      return <span className='new-flag category-label'>NEW</span>
    }
  }

  render() {
    return (
      <div style={{backgroundColor: this.getBackgroundColor()}} className='first-row'>
        <div className='col-xs-12'>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className='unit-template-type'>
              {this.props.data.type.name}
            </div>
            <CategoryLabel
              data={this.props.data.unit_template_category}
              extraClassName='float-right'
            />
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div className='unit-template-name'>
                {this.props.data.name}
                {this.newFlag()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
