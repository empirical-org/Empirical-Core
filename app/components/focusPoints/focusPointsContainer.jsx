import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointForm from './focusPointForm.jsx';
import questionActions from '../../actions/questions.js'
import {hashToCollection} from '../../libs/hashToCollection'

class FocusPointsContainer extends Component {
  constructor() {
    super();
    this.deleteFocusPoint = this.deleteFocusPoint.bind(this);
    this.submitFocusPointForm = this.submitFocusPointForm.bind(this);
  }

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  getFocusPoints() {
    return this.getQuestion().focusPoints;
  }

  submitFocusPointForm(data, focusPoint) {
    if(focusPoint) {
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.params.questionID, data, focusPoint));
    } else {
      this.props.dispatch(questionActions.submitNewFocusPoint(this.props.params.questionID, data));
    }
  }

  deleteFocusPoint(focusPointID) {
    if(confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteFocusPoint(this.props.params.questionID, focusPointID));
    }
  }

  renderFocusPointTagsForFocusPoint(focusPoint) {
    return focusPoint.split('|||').map((fp) => {
      return(<span className="tag is-medium is-light" style={{margin: '3px'}}>{fp}</span>)
    });
  }

  renderConceptResults(concepts) {
    if(concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p className="control sub-title is-6">{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{marginLeft: 5}}>Correct</span>
          : <span className="tag is-small is-danger" style={{marginLeft: 5}}>Incorrect</span> }
        </p>
        )
      );
      return _.values(components);
    }
  }

  renderFocusPointsList() {
    const components = _.mapObject(this.getFocusPoints(), (val, key) => (
      <div className="card is-fullwidth has-bottom-margin">
        <header className="card-header">
          <p className="card-header-title" style={{display: 'inline-block'}}>
            {this.renderFocusPointTagsForFocusPoint(val.text)}
          </p>
          <p className="card-header-icon">
            {/* TODO: make val.order display here once ordering functionality is implemented */}
          </p>
        </header>
        <div className="card-content">
          <p className="control title is-4"><strong>Feedback</strong>: {val.feedback}</p>
          {this.renderConceptResults(val.concepts)}
        </div>
        <FocusPointForm fp={Object.assign(val, {id: key})} submitFocusPoint={this.submitFocusPointForm} deleteFocusPoint={this.deleteFocusPoint} />
      </div>
    ));
    return _.values(components);
  }

  render() {
    return (
      <div>
        <div className='has-top-margin'>
          <h1 className="title is-3" style={{display: 'inline-block'}}>Focus Points</h1>
          <FocusPointForm submitFocusPoint={this.submitFocusPointForm} />
        </div>
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
