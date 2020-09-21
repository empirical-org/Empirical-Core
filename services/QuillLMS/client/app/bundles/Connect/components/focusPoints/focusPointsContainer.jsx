import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import {
  SortableList
} from 'quill-component-library/dist/componentLibrary';

import { hashToCollection, } from '../../../Shared/index'

export class FocusPointsContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { fpOrderedIds: null, questionType, actionFile, questionTypeLink };
  }

  getFocusPoints = () => {
    return this.getQuestion().focusPoints;
  }

  getQuestion = () => {
    const { questionType } = this.state
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    return this.props[questionType].data[questionID];
  }

  deleteConceptResult = (conceptResultKey, focusPointKey) => {
    const { actionFile } = this.state
    const { submitEditedFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getFocusPoints()[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(submitEditedFocusPoint(questionID, data, focusPointKey));
    }
  }

  deleteFocusPoint = focusPointID => {
    const { actionFile } = this.state
    const { deleteFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(deleteFocusPoint(questionID, focusPointID));
    }
  };

  fPsortedByOrder = () => {
    const { fpOrderedIds } = this.state
    if (fpOrderedIds) {
      const focusPoints = hashToCollection(this.getFocusPoints())
      return fpOrderedIds.map(id => focusPoints.find(fp => fp.key === id))
    } else {
      return hashToCollection(this.getFocusPoints()).sort((a, b) => a.order - b.order);
    }
  }

  sortCallback = sortInfo => {
    const fpOrderedIds = sortInfo.data.items.map(item => item.key);
    this.setState({ fpOrderedIds, });
  };

  updatefpOrder = () => {
    const { actionFile, fpOrderedIds } = this.state
    const { submitBatchEditedFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (fpOrderedIds) {
      const focusPoints = this.getFocusPoints();
      const newFp = {};
      fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      dispatch(submitBatchEditedFocusPoint(questionID, newFp));
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  };

  renderConceptResults = (concepts, focusPointKey) => {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p className="control sub-title is-6" key={`${val.name}`}>{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
          : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" onClick={() => this.deleteConceptResult(key, focusPointKey)} style={{ cursor: 'pointer', marginLeft: 5, }}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }

  renderFocusPointsList = () => {
    const { questionTypeLink } = this.state
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    const components = this.fPsortedByOrder().map((fp) => {
      if (fp.text) {
        return (
          <div className="card is-fullwidth has-bottom-margin" key={fp.key}>
            <header className="card-header">
              <p className="card-header-title" style={{ display: 'inline-block', }}>
                {this.renderTagsForFocusPoint(fp.text)}
              </p>
              <p className="card-header-icon">
                {fp.order}
              </p>
            </header>
            <div className="card-content">
              <p className="control title is-4" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + fp.feedback, }} />
              {this.renderConceptResults(fp.conceptResults, fp.key)}
            </div>
            <footer className="card-footer">
              <NavLink className="card-footer-item" to={`${match.url}/${fp.key}/edit`}>Edit</NavLink>
              <a className="card-footer-item" onClick={() => this.deleteFocusPoint(fp.key)}>Delete</a>
            </footer>
          </div>
        );
      }
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  renderTagsForFocusPoint = (focusPointString) => {
    return focusPointString.split('|||').map((fp, index) => (<span className="tag is-medium is-light" key={`fp${index}`} style={{ margin: '3px', }}>{fp}</span>));
  }

  renderfPButton = () => {
    const { fpOrderedIds } = this.state
    return (
      fpOrderedIds ? <button className="button is-outlined is-primary" onClick={this.updatefpOrder} style={{ float: 'right', }}>Save FP Order</button> : null
    );
  }

  render() {
    const { questionTypeLink } = this.state
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
          <a className="button is-outlined is-primary" href={`#${match.url}/new`} style={{ float: 'right', }}>Add Focus Point</a>
          {this.renderfPButton()}
        </div>
        {this.renderFocusPointsList()}
      </div>
    );
  }
}

function select(props) {
  let mapState
  if (window.location.href.includes('sentence-fragments')) {
    mapState = {
      sentenceFragments: props.sentenceFragments
    };
  } else {
    mapState = {
      questions: props.questions
    };
  }
  return mapState
}

export default connect(select)(FocusPointsContainer);
