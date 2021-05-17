import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import { NavLink } from 'react-router-dom';
import { hashToCollection, SortableList, } from '../../../Shared/index'

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

  getFocusPoints = (question) => {
    return question.focusPoints;
  }

  deleteFocusPoint = focusPointID => {
    const { focusPoints } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(this.state.actionFile.deleteFocusPoint(questionID, focusPointID));
      delete focusPoints[focusPointID]
      this.setState({focusPoints: focusPoints})
    }
  };

  deleteConceptResult = (conceptResultKey, focusPointKey) => {
    const { focusPoints } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = focusPoints[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(this.state.actionFile.submitEditedFocusPoint(questionID, data, focusPointKey));
    }
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

  fPsortedByOrder = () => {
    const { fpOrderedIds, focusPoints } = this.state;
    if (fpOrderedIds) {
      const focusPointsCollection = hashToCollection(focusPoints)
      return fpOrderedIds.map(id => focusPointsCollection.find(fp => fp.key === id))
    } else {
      return hashToCollection(focusPoints).sort((a, b) => a.order - b.order);
    }
  }

  saveFocusPoint = (key) => {
    const { actionFile } = this.state
    const { submitEditedFocusPoint } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { focusPoints } = this.state
    let data = focusPoints[key]
    delete data.conceptResults.null;
    dispatch(submitEditedFocusPoint(questionID, data, key));
  };

  renderFocusPointsList = () => {
    const { questionTypeLink } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const components = this.fPsortedByOrder().map((fp) => {
      const { conceptResults, feedback, key, order, text } = fp;
      if (text) {
        return (
          <div className="card is-fullwidth has-bottom-margin" key={key}>
            <header className="card-header">
              <p className="card-header-title" style={{ display: 'inline-block', }}>
                {this.renderTextInputFields(text, key)}
              </p>
              <p className="card-header-icon">
                {order}
              </p>
            </header>
            <div className="card-content">
              <p className="control title is-4" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + feedback, }} />
              {this.renderConceptResults(conceptResults, key)}
            </div>
            <footer className="card-footer">
              <NavLink className="card-footer-item" to={`/admin/${questionTypeLink}/${questionID}/focus-points/${key}/edit`}>Edit</NavLink>
              <a className="card-footer-item" onClick={() => this.deleteFocusPoint(key)}>Delete</a>
            </footer>
          </div>
        );
      }
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  handleChange = (e, key) => {
    const { focusPoints } = this.state
    let value = e.target.value;
    let className = `regex-${key}`
    value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}`;
    focusPoints[key].text = value;
    this.setState({focusPoints: focusPoints})
  }

  renderTextInputFields = (sequenceString, key) => {
    let className = `input regex-inline-edit regex-${key}`
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      <input className={className} onBlur={(e) => this.saveFocusPoint(key)} onChange={(e) => this.handleChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
    ));
  }

  sortCallback = sortInfo => {
    const fpOrderedIds = sortInfo.map(item => item.key);
    this.setState({ fpOrderedIds, });
  };

  updatefpOrder = () => {
    const { actionFile, fpOrderedIds, focusPoints } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (fpOrderedIds) {
      const newFp = {};
      fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      this.props.dispatch(actionFile.submitBatchEditedFocusPoint(questionID, newFp));
      this.setState({focusPoints: newFp})
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  };

  renderfPButton = () => {
    const { fpOrderedIds } = this.state;
    return (
      fpOrderedIds ? <button className="button is-outlined is-primary" onClick={this.updatefpOrder} style={{ float: 'right', }}>Save FP Order</button> : null
    );
  }

  render() {
    const { questionTypeLink } = this.state;
    const { children, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
          <a className="button is-outlined is-primary" href={`/diagnostic/#/admin/${questionTypeLink}/${questionID}/focus-points/new`} rel="noopener noreferrer" style={{ float: 'right', }} target="_blank">Add Focus Point</a>
          {this.renderfPButton()}
        </div>
        {this.renderFocusPointsList()}
        {children}
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
