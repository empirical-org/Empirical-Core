import React from 'react'
import _ from 'underscore'
import ListFilterOption from './list_filter_option'

export default class ListFilterOptions extends React.Component {
  sortViews(views) {
    const order = ['All', 'Elementary', 'Middle', 'High', 'University', 'ELL', 'Themed'];
    return _.compact(_.map(order, (option) => {
      return _.findWhere(views, { name: option });
    }));
  }

  generateViews() {
    const allOption = {
      id: null,
      name: 'All'
    };
    const options = this.props.options ? [allOption].concat(this.props.options) : [allOption];
    const sortedOptions = this.sortViews(options);
    const arr = _.map(sortedOptions, this.generateView, this);
    return arr;
  }

  getKey(option) {
    return option.id;
  }

  isSelected(option) {
    return (this.props.selectedId === option.id);
  }

  generateView(option) {
    return (<ListFilterOption
      userLoggedIn={this.props.userLoggedIn}
      key={this.getKey(option)}
      data={option}
      isSelected={this.isSelected(option)}
    />)
  }

  render() {
    return (
      <div className='list-filter-options-container'>
        <div className='list-filter-options'>
           {this.generateViews()}
        </div>
      </div>
    );
  }
}
