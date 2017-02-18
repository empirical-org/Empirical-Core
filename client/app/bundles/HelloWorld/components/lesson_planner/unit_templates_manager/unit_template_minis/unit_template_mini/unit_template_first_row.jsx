'use strict'

 import React from 'react'
 import CategoryLabel from '../../../category_labels/category_label'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    modules: React.PropTypes.shape({
      string: React.PropTypes.object.isRequired
    })
  },

  sayNumberOfStandards: function () {
    return this.props.modules.string.sayNumberOfThings(this.props.data.number_of_standards, 'Standard', 'Standards');
  },

  getClassName: function () {
    return ['row', 'first-row'].join(' ');
  },

  getBackgroundColor: function () {
    return this.props.data.unit_template_category.primary_color;
  },

  getCategoryBackgroundColor: function () {
    return this.props.data.unit_template_category.secondary_color;
  },

  render: function () {

    return (
      <div style={{backgroundColor: this.getBackgroundColor()}} className={this.getClassName()}>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-8'>
              <div className='standards-count'>
                {this.sayNumberOfStandards()}
              </div>
            </div>
            <div className='col-xs-4 text-right'>
              <CategoryLabel
                  filterByCategory={this.props.actions.filterByCategory}
                  data={this.props.data.unit_template_category}
                  extraClassName='float-right'
                  backgroundColor={this.getCategoryBackgroundColor()}/>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div className='unit-template-name'>
                {this.props.data.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
