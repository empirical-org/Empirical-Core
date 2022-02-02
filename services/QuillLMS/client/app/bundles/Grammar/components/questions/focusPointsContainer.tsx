import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'underscore';
import { EditorState, ContentState } from 'draft-js'

import { TextEditor } from '../../../Shared/index';
import * as questionActions from '../../actions/questions';
import { hashToCollection, SortableList,  } from '../../../Shared/index'

export class FocusPointsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.deleteFocusPoint = this.deleteFocusPoint.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
    this.updatefpOrder = this.updatefpOrder.bind(this);

    const question = this.props.questions.data[this.props.match.params.questionID]
    const focusPoints = this.getFocusPoints(question)

    this.state = { fpOrderedIds: null, focusPoints: focusPoints };
  }

  getFocusPoints(question) {
    return question.focusPoints;
  }

  deleteFocusPoint(focusPointID) {
    const { focusPoints } = this.state
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteFocusPoint(this.props.match.params.questionID, focusPointID));
      delete focusPoints[focusPointID]
      this.setState({focusPoints: focusPoints})
    }
  }

  deleteConceptResult(conceptResultKey, focusPointKey) {
    const { focusPoints } = this.state
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = focusPoints[focusPointKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.match.params.questionID, data, focusPointKey));
    }
  }
  //
  fPsortedByOrder() {
    const { focusPoints } = this.state
    if (this.state.fpOrderedIds) {
      const focusPointsCollection = hashToCollection(focusPoints)
      return this.state.fpOrderedIds.map(id => focusPointsCollection.find(fp => fp.key === id))
    } else {
      return hashToCollection(focusPoints).sort((a, b) => a.order - b.order);
    }
  }

  saveFocusPointsAndFeedback = (key) => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { focusPoints } = this.state
    const filteredFocusPoints = this.removeEmptyFocusPoints(focusPoints)
    let data = filteredFocusPoints[key]
    delete data.conceptResults.null;
    if (data.text === '') {
      delete filteredFocusPoints[key]
      dispatch(questionActions.deleteFocusPoint(questionID, key));
    } else {
      dispatch(questionActions.submitEditedFocusPoint(questionID, data, key));
    }
    this.setState({focusPoints: filteredFocusPoints})
  }

  removeEmptyFocusPoints = (focusPoints) => {
    return _.mapObject(focusPoints, (val) => (
      Object.assign({}, val, {
        text: val.text.split(/\|{3}(?!\|)/).filter(val => val !== '').join('|||')
      })
    )
    );
  }

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

  sortCallback(sortInfo) {
    const fpOrderedIds = sortInfo.map(item => item.key);
    this.setState({ fpOrderedIds, });
  }

  updatefpOrder() {
    const { focusPoints } = this.state
    if (this.state.fpOrderedIds) {
      const focusPoints = focusPoints;
      const newFp = {};
      this.state.fpOrderedIds.forEach((id, index) => {
        const fp = Object.assign({}, focusPoints[id]);
        fp.order = index + 1;
        newFp[id] = fp;
      });
      this.props.dispatch(questionActions.submitBatchEditedFocusPoint(this.props.match.params.questionID, newFp));
      this.setState({ focusPoints: newFp})
      alert('saved!');
    } else {
      alert('no changes to focus points have been made');
    }
  }

  renderFocusPointsList() {
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
              text={fp.feedback}
            />
            {this.renderConceptResults(fp.conceptResults, fp.key)}
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" href={`/grammar/#/admin/questions/${this.props.match.params.questionID}/focus-points/${fp.key}/edit`}>Edit</a>
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
      <input className={className} onChange={(e) => this.handleFocusPointChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
    ));
  }

  renderfPButton() {
    return (
      this.state.fpOrderedIds ? <button className="button is-outlined is-primary" onClick={this.updatefpOrder} style={{ float: 'right', }}>Save FP Order</button> : null
    );
  }

  renderConceptResults(concepts, focusPointKey) {
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

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Focus Points</h1>
          <a className="button is-outlined is-primary" href={`/grammar/#/admin/questions/${this.props.match.params.questionID}/focus-points/new`} rel="noopener noreferrer" style={{ float: 'right', }} target="_blank">Add Focus Point</a>
          {this.renderfPButton()}
        </div>
        {this.renderFocusPointsList()}
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions
  };
}

export default connect(select)(FocusPointsContainer);
