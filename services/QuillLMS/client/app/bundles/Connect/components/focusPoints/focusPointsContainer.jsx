import { ContentState, EditorState } from 'draft-js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'underscore';

import { hashToCollection, SortableList, TextEditor } from '../../../Shared/index';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

export class FocusPointsContainer extends Component {
  constructor(props) {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions
    const question = props[questionType].data[props.match.params.questionID]
    const focusPoints = this.getFocusPoints(question)

    this.state = { fpOrderedIds: null, questionType, actionFile, questionTypeLink, focusPoints };
  }

  componentDidUpdate(previousProps, previousState) {
    const question = this.props[this.state.questionType].data[this.props.match.params.questionID]
    const focusPoints = this.getFocusPoints(question)

    if (previousState.focusPoints === focusPoints) return;

    this.setState({ focusPoints, });
  }

  getFocusPoints = (question) => {
    return question.focusPoints;
  }

  deleteConceptResult = (conceptResultKey, focusPointKey) => {
    const { actionFile, focusPoints } = this.state
    const { submitEditedFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = focusPoints[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(submitEditedFocusPoint(questionID, data, focusPointKey));
    }
  }

  deleteFocusPoint = focusPointID => {
    const { actionFile, focusPoints } = this.state
    const { deleteFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(deleteFocusPoint(questionID, focusPointID));
      delete focusPoints[focusPointID]
      this.setState({focusPoints: focusPoints})
    }
  };

  fPsortedByOrder = () => {
    const { fpOrderedIds, focusPoints } = this.state
    if (fpOrderedIds) {
      const focusPointsCollection = hashToCollection(focusPoints)
      return fpOrderedIds.map(id => focusPointsCollection.find(fp => fp.key === id))
    } else {
      return hashToCollection(focusPoints).sort((a, b) => a.order - b.order);
    }
  }

  sortCallback = sortInfo => {
    const fpOrderedIds = sortInfo.map(item => item.key);
    this.setState({ fpOrderedIds, });
  };

  saveFocusPointsAndFeedback = (key) => {
    const { actionFile } = this.state
    const { submitEditedFocusPoint, deleteFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { focusPoints } = this.state
    const filteredFocusPoints = this.removeEmptyFocusPoints(focusPoints)
    let data = filteredFocusPoints[key]
    delete data.conceptResults.null;
    if (data.text === '') {
      delete filteredFocusPoints[key]
      dispatch(deleteFocusPoint(questionID, key));
    } else {
      dispatch(submitEditedFocusPoint(questionID, data, key));
    }
    this.setState({focusPoints: filteredFocusPoints})
  };

  removeEmptyFocusPoints = (focusPoints) => {
    return _.mapObject(focusPoints, (val) => (
      Object.assign({}, val, {
        text: val.text.split(/\|{3}(?!\|)/).filter(val => val !== '').join('|||')
      })
    )
    );
  }

  updatefpOrder = () => {
    const { actionFile, fpOrderedIds, focusPoints } = this.state
    const { submitBatchEditedFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (fpOrderedIds) {
      const newFp = {};
      fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      dispatch(submitBatchEditedFocusPoint(questionID, newFp));
      this.setState({focusPoints: newFp})
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  };

  addNewFocusPoint = (e, key) => {
    const { focusPoints } = this.state
    const className = `regex-${key}`
    const value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    focusPoints[key].text = value;
    this.setState({focusPoints: focusPoints})
  }

  handleNameChange = (e, key) => {
    const { focusPoints } = this.state
    focusPoints[key].name = e.target.value
    this.setState({focusPoints: focusPoints})
  }

  handleFocusPointChange = (e, key) => {
    const { focusPoints } = this.state
    const className = `regex-${key}`
    const value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}`;
    if (value === '') {
      if (!confirm("Deleting this regex will delete the whole incorrect sequence. Are you sure you want that?")) {
        return
      }
    }
    focusPoints[key].text = value;
    this.setState({focusPoints: focusPoints})
  }

  handleFeedbackChange = (e, key) => {
    const { focusPoints } = this.state
    focusPoints[key].feedback = e
    this.setState({focusPoints: focusPoints})
  }

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
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    const components = this.fPsortedByOrder().map((fp) => {
      return (
        <div className="card is-fullwidth has-bottom-margin" key={fp.key}>
          <header className="card-header">
            <input className="regex-name" onChange={(e) => this.handleNameChange(e, fp.key)} placeholder="Name" type="text" value={fp.name || ''} />
          </header>
          <header className="card-header">
            <p className="card-header-title" style={{ display: 'inline-block', }}>
              {this.renderTextInputFields(fp.text, fp.key)}
              <button className="add-regex-button" onClick={(e) => this.addNewFocusPoint(e, fp.key)} type="button">+</button>
            </p>
            <p className="card-header-icon">
              {fp.order}
            </p>
          </header>
          <div className="card-content">
            <label className="label" htmlFor="feedback" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={(e) => this.handleFeedbackChange(e, fp.key)}
              key="feedback"
              shouldCheckSpelling={true}
              text={fp.feedback}
            />
            {this.renderConceptResults(fp.conceptResults, fp.key)}
          </div>
          <footer className="card-footer">
            <NavLink className="card-footer-item" to={`${match.url}/${fp.key}/edit`}>Edit</NavLink>
            <a className="card-footer-item" onClick={() => this.deleteFocusPoint(fp.key)}>Delete</a>
            <a className="card-footer-item" onClick={() => this.saveFocusPointsAndFeedback(fp.key)}>Save</a>
          </footer>
        </div>
      );
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  renderTextInputFields = (sequenceString, key) => {
    let className = `input regex-inline-edit regex-${key}`
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      <input className={className} key={key} onChange={(e) => this.handleFocusPointChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
    ));
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
          <a className="button is-outlined is-primary" href={`#${match.url}/new`} rel="noopener noreferrer" style={{ float: 'right', }}>Add Focus Point</a>
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
