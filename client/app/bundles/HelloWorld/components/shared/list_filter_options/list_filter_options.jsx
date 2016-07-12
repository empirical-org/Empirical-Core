'use strict'

 import React from 'react'
 import _ from 'underscore'
 import ListFilterOption from './list_filter_option'


 export default  React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired,
  },

  sortViews: function (views) {
    var order = ["All", "Elementary", "Middle", "High", "University", "ELL", "Themed"];
    return _.compact(_.map(order, function(option) {
      return _.findWhere(views, {name: option});
    }));
  },

  generateViews: function () {
    var allOption = {
      id: null,
      name: 'All'
    };
    var options = this.props.options ? [allOption].concat(this.props.options) : [allOption];
    var sortedOptions = this.sortViews(options);
    var arr =_.map(sortedOptions, this.generateView, this);
    return arr;
  },

  getKey: function (option) {
    return option.id;
  },

  isSelected: function (option) {
    return (this.props.selectedId === option.id);
  },

  generateView: function (option) {
    return <ListFilterOption
                    key={this.getKey(option)}
                    data={option}
                    isSelected={this.isSelected(option)}
                    select={this.props.select} />
  },

  render: function () {
    return (
      <div className='list-filter-options'>
        {this.generateViews()}
      </div>
    );
  }
})
