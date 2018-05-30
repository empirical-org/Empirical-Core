import React from 'react';
import _ from 'underscore';
import PageNumber from './page_number';

export default React.createClass({

  propTypes: {
    currentPage: React.PropTypes.number.isRequired,
    numberOfPages: React.PropTypes.number.isRequired,
    selectPageNumber: React.PropTypes.func.isRequired,
    maxPageNumber: React.PropTypes.number.isRequired,
  },

  leftArrow() {
    if (this.props.currentPage > 1) {
      this.props.selectPageNumber(this.props.currentPage - 1);
    }
  },
  rightArrow() {
    if (this.props.currentPage < this.props.numberOfPages) {
      this.props.selectPageNumber(this.props.currentPage + 1);
    }
  },

  render() {
    let result;

    if (this.props.numberOfPages > 1) {
      const pages = [];
      let firstPage;

      if (this.props.numberOfPages - this.props.currentPage >= this.props.maxPageNumber) {
        firstPage = this.props.currentPage;
      } else if (this.props.numberOfPages > this.props.maxPageNumber) {
        firstPage = this.props.numberOfPages - this.props.maxPageNumber + 1;
      } else {
        firstPage = 1;
      }

      _.times(this.props.numberOfPages, function (pageNumber) {
        if (pageNumber < this.props.maxPageNumber) {
          const actualPageNumber = firstPage + pageNumber;
          const ele = <PageNumber key={pageNumber} selectPageNumber={this.props.selectPageNumber} number={actualPageNumber} currentPage={this.props.currentPage} />;
          pages.push(ele);
        }
      }, this);

      result = (
        <ul className="pagination">
          <li onClick={this.leftArrow} className="left_arrow">
            <span>
              <i className="fa fa-caret-left" />
            </span>
          </li>
          {pages}
          <li onClick={this.rightArrow} className="right_arrow">
            <span>
              <i className="fa fa-caret-right" />
            </span>
          </li>
        </ul>
			);
    } else {
      result = <span />;
    }

    return result;
  },

});
