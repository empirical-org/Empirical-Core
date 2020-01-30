import React from 'react';

export default class RecommendationsTableCell extends React.Component {

  renderCheck() {
    const { previouslyAssigned, selected, } = this.props
    if (previouslyAssigned) {
      return (
        <i className="fas fa-check-circle" />
      );
    }	else if (selected) {
      return (
        <img className="recommendation-check" src="/images/recommendation_check.svg" />
      );
    }
  }

  handleCheckboxClick = () => {
    const { checkboxOnClick, student, index, } = this.props
    checkboxOnClick(student, index)
  }

  render() {
    const { previouslyAssigned, recommended, selected, recommendation, } = this.props
    let checkboxClass,
      checkboxOnClick;
    if (previouslyAssigned) {
      checkboxClass = 'previously-assigned-checkbox';
      checkboxOnClick = null;
    } else {
      checkboxClass = 'donalito-checkbox';
      checkboxOnClick = this.handleCheckboxClick;
    }
    return (
      <div className={`recommendations-table-row-item${previouslyAssigned}${recommended}${selected}`} onClick={checkboxOnClick}>
        <div className={checkboxClass} >
          {this.renderCheck()}
        </div>
        <p>{recommendation.name}</p>
      </div>);
  }
}
