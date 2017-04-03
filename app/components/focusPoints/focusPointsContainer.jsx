import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointForm from './focusPointForm.jsx';
import questionActions from '../../actions/questions.js';
import { hashToCollection } from '../../libs/hashToCollection';
import SortableList from '../questions/sortableList/sortableList.jsx';

class FocusPointsContainer extends Component {
  constructor() {
    super();
    this.deleteFocusPoint = this.deleteFocusPoint.bind(this);
    this.submitFocusPointForm = this.submitFocusPointForm.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
  }

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  getFocusPoints() {
    return this.getQuestion().focusPoints;
  }

  submitFocusPointForm(data, focusPoint) {
    delete data.conceptResults.null;
    if (focusPoint) {
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.params.questionID, data, focusPoint));
    } else {
      this.props.dispatch(questionActions.submitNewFocusPoint(this.props.params.questionID, data));
    }
  }

  deleteFocusPoint(focusPointID) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteFocusPoint(this.props.params.questionID, focusPointID));
    }
  }

  deleteConceptResult(conceptResultKey, focusPointKey) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getFocusPoints()[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.params.questionID, data, focusPointKey));
    }
  }

  renderFocusPointTagsForFocusPoint(focusPoint) {
    return focusPoint.split('|||').map((fp, index) => (<span key={`fp${index}`} className="tag is-medium is-light" style={{ margin: '3px', }}>{fp}</span>));
  }

  renderConceptResults(concepts, focusPointKey) {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p key={`${val.name}`}className="control sub-title is-6">{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
          : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" style={{ cursor: 'pointer', marginLeft: 5, }} onClick={() => this.deleteConceptResult(key, focusPointKey)}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }

  renderFocusPointsList() {
    const components = _.mapObject(this.getFocusPoints(), (val, key) => (
      <div key={key} className="card is-fullwidth has-bottom-margin">
        <header className="card-header">
          <p className="card-header-title" style={{ display: 'inline-block', }}>
            {this.renderFocusPointTagsForFocusPoint(val.text)}
          </p>
          <p className="card-header-icon">
            {val.order}
          </p>
        </header>
        <div className="card-content">
          <p className="control title is-4"><strong>Feedback</strong>: {val.feedback}</p>
          {this.renderConceptResults(val.conceptResults, key)}
        </div>
        <FocusPointForm fp={Object.assign(val, { id: key, })} submitFocusPoint={this.submitFocusPointForm} deleteFocusPoint={this.deleteFocusPoint} />
      </div>
    ));
    return <SortableList key={_.values(components).length} sortCallback={this.sortCallback} data={_.values(components)} />;
  }

  sortCallback(sortInfo) {
    if (sortInfo.draggingIndex !== null) {
      const index = parseInt(sortInfo.draggingIndex);
      const data = { order: index, };
      const focusPointId = sortInfo.data.items[index].key;
      // const focusPoint = this.getFocusPoints()[focusPointKey];
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.params.questionID, data, focusPointId));
    }
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
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
