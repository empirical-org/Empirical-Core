import React from 'react';

export default React.createClass({

  clickSort() {
    let new_asc_or_desc;
    if (this.props.data.asc_or_desc == 'desc') {
      new_asc_or_desc = 'asc';
    } else {
      new_asc_or_desc = 'desc';
    }
    this.props.updateSort(this.props.data.field, new_asc_or_desc);
  },

  render() {
    let arrowIfSortable, arrowDirection;
    if (this.props.data.sortPath) {
      if (this.props.data.asc_or_desc == 'desc') {
        arrowDirection = 'down';
      } else {
        arrowDirection = 'up';
      }
      arrowIfSortable = <i className= {`fa fa-caret-${arrowDirection}`} />
    }
    return (
      <th className={`sorter ${this.props.data.className}`} onClick={this.clickSort}>
        {this.props.data.alias}
        {arrowIfSortable}
      </th>
    );
  },
});
