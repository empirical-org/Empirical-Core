import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointForm from './focusPointForm.jsx';

class FocusPointsContainer extends Component {

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  getFocusPoints() {
    return this.getQuestion().focusPoints;
  }

  submitFocusPointForm(data, newFocusPoint) {
    if (!newFocusPoint) {
      this.props.dispatch(this.state.actions.submitEditedFocusPoint(this.props.questionID, data, this.getFocusPoint().key));
    } else {
      this.props.dispatch(this.state.actions.submitNewFocusPoint(this.props.questionID, data));
    }
  }

  renderFocusPointTagsForFocusPoint(focusPoint) {
    return focusPoint.split('|||').map((fp) => {
      return(<span className="tag is-medium is-light" style={{margin: '0 3px'}}>{fp}</span>)
    });
  }

  renderConceptResults(crUID) {
    //TODO: make this work
    if(crUID) {
      return (
        <p className="control sub-title is-6"><strong>Concept</strong>: {crUID}</p>
      )
    }
  }

  renderFocusPointsList() {
    const components = _.mapObject(this.getFocusPoints(), (val, key) => (
      <div className="card is-fullwidth has-bottom-margin has-top-margin">
        <header className="card-header">
          <p className="card-header-title">
            {this.renderFocusPointTagsForFocusPoint(val.text)}
          </p>
          <p className="card-header-icon">
            #{val.order}
          </p>
        </header>
        <div className="card-content">
          <p className="control title is-4"><strong>Feedback</strong>: {val.feedback}</p>
          {this.renderConceptResults(val.conceptUID)}
        </div>
        <FocusPointForm fp={val} submitFocusPoint={this.submitFocusPointForm} />
      </div>
    ));
    return _.values(components);
  }

  render() {
    return (
      <div>
        <h1 className="title is-3 has-top-margin">Focus Points <FocusPointForm submitFocusPoint={this.submitFocusPointForm} /></h1>
        {this.renderFocusPointsList()}
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(FocusPointsContainer);
