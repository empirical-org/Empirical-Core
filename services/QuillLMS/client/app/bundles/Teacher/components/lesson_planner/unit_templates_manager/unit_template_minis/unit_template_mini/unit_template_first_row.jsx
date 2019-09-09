import React from 'react'
import CategoryLabel from '../../../category_labels/category_label'
import moment from 'moment'

const cutOffTimeForNew = moment().subtract('months', 1).unix()

export default class UnitTemplateFirstRow extends React.Component {
  sayNumberOfStandards() {
    return this.props.modules.string.sayNumberOfThings(this.props.data.number_of_standards, 'Standard', 'Standards');
  }

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
          <div className='row' style={{padding: '0px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{flex: 1}}>
              <div className='standards-count'>
                {this.sayNumberOfStandards()}
              </div>
            </div>
            <div className='text-right' style={{flex: 1}}>
              <CategoryLabel
                data={this.props.data.unit_template_category}
                extraClassName='float-right'
              />
            </div>
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
