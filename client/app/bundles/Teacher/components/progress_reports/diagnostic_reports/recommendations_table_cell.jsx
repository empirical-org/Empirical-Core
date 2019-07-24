import React from 'react';

export default class RecommendationsTableCell extends React.Component {

  renderCheck() {
    if (this.props.previouslyAssigned) {
      return (
        <i className="fa fa-check-circle" />
      );
    }		else if (this.props.selected) {
      return (
        <img className="recommendation-check" src="/images/recommendation_check.svg" />
      );
    }
  }

  render() {
    let checkboxClass,
      checkboxOnClick;
    if (this.props.previouslyAssigned) {
      checkboxClass = 'previously-assigned-checkbox';
      checkboxOnClick = null;
    } else {
      checkboxClass = 'donalito-checkbox';
      checkboxOnClick = this.props.checkboxOnClick;
    }
    return (
      <div className={`recommendations-table-row-item${this.props.previouslyAssigned}${this.props.recommended}${this.props.selected}`} onClick={checkboxOnClick}>
        <div className={checkboxClass} >
          {this.renderCheck()}
        </div>
        <p>{this.props.recommendation.name}</p>
      </div>);
  }
}
