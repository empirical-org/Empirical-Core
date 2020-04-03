import React from 'react';
import _ from 'underscore';
import PageNumber from './page_number';

export default class Pagination extends React.Component {
  leftArrow = () => {
    if (this.props.currentPage > 1) {
      this.props.selectPageNumber(this.props.currentPage - 1);
    }
  };

  rightArrow = () => {
    if (this.props.currentPage < this.props.numberOfPages) {
      this.props.selectPageNumber(this.props.currentPage + 1);
    }
  };

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
          const ele = <PageNumber currentPage={this.props.currentPage} key={pageNumber} number={actualPageNumber} selectPageNumber={this.props.selectPageNumber} />;
          pages.push(ele);
        }
      }, this);

      result = (
        <ul className="pagination">
          <li className="left_arrow" onClick={this.leftArrow}>
            <span>
              <i className="fas fa-caret-left" />
            </span>
          </li>
          {pages}
          <li className="right_arrow" onClick={this.rightArrow}>
            <span>
              <i className="fas fa-caret-right" />
            </span>
          </li>
        </ul>
			);
    } else {
      result = <span />;
    }

    return result;
  }
}
