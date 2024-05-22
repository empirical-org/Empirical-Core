import { ContentState, EditorState } from 'draft-js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'underscore';
import { v4 as uuid } from 'uuid';

import { SortableList, TextEditor, hashToCollection, isValidRegex } from '../../../Shared/index';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

class IncorrectSequencesContainer extends Component {
  constructor(props) {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions
    const question = props[questionType].data[props.match.params.questionID]
    const incorrectSequences = question.incorrectSequences

    const sequencesCollection = hashToCollection(incorrectSequences)
    const orderedIds = sequencesCollection.sort((a, b) => a.order - b.order).map(b => b.key);

    this.state = { orderedIds, questionType, actionFile, questionTypeLink, incorrectSequences };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { incorrectSequences } = this.state
    const { match, questions } = nextProps
    const { params } = match

    const incomingIncorrectSequences = questions.data[params.questionID].incorrectSequences
    const incomingOrderedIds = hashToCollection(incomingIncorrectSequences).sort((a, b) => a.order - b.order).map(seq => seq.key)
    if (!_.isEqual(incorrectSequences, incomingIncorrectSequences)) {
      this.setState({ incorrectSequences: incomingIncorrectSequences, orderedIds: incomingOrderedIds})
    }
  }

  getSequences = (question) => {
    return hashToCollection(question.incorrectSequences).map(is => {
      is.uid = is.uid || uuid()
      return is
    }).filter(incorrectSequence => incorrectSequence);
  }

  deleteConceptResult = (conceptResultKey, sequenceKey) => {
    const { actionFile, incorrectSequences } = this.state
    const { submitEditedIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = incorrectSequences[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(actionFile.submitEditedIncorrectSequence(questionID, data, data.key));
    }
  }

  deleteSequence = sequenceID => {
    const { actionFile, incorrectSequences, orderedIds } = this.state
    const { deleteIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(deleteIncorrectSequence(questionID, sequenceID));
      delete incorrectSequences[sequenceID];
      const newOrderedIds = orderedIds.filter(id => id !== sequenceID)
      const incorrectSequenceArray = hashToCollection(incorrectSequences)

      let newIncorrectSequences = {}
      newOrderedIds.forEach((id, index) => {
        const sequence = incorrectSequenceArray.find(is => is.key === id);
        sequence.order = index
        newIncorrectSequences[sequence.key] = sequence
      })

      if (incorrectSequenceArray.length > 0) {
        dispatch(questionActions.updateIncorrectSequences(questionID, newIncorrectSequences, this.alertDeleted))
      } else {
        this.alertDeleted()
      }

      this.setState({ orderedIds: newOrderedIds, incorrectSequences: newIncorrectSequences })
    }
  };

  sequencesSortedByOrder = () => {
    const { orderedIds, incorrectSequences } = this.state

    const sequencesCollection = Array.isArray(incorrectSequences) ? incorrectSequences : hashToCollection(incorrectSequences)

    return orderedIds.map(id => sequencesCollection.find(s => s.key === id))

  }

  sortCallback = sortInfo => {
    const orderedIds = sortInfo.map(item => item.key);
    this.setState({ orderedIds });
  };

  alertSaved = () => {
    alert('Saved!')
  }

  alertDeleted = () => {
    alert('Deleted!')
  }

  handleSaveAllSequences = () => {
    const { orderedIds, incorrectSequences } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const newIncorrectSequences = {}
    const incorrectSequenceArray = hashToCollection(incorrectSequences)
    orderedIds.forEach((id, index) => {
      const sequence = incorrectSequenceArray.find(is => is.key === id);
      sequence.order = index
      newIncorrectSequences[sequence.key] = sequence
    })
    dispatch(questionActions.updateIncorrectSequences(questionID, newIncorrectSequences, this.alertSaved))
  }

  updateOrder = () => {
    const { actionFile, orderedIds, incorrectSequences } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (orderedIds) {
      const newIncorrectSequences = {}
      const incorrectSequenceArray = hashToCollection(incorrectSequences)
      orderedIds.forEach((id, index) => {
        const sequence = incorrectSequenceArray.find(is => is.key === id);
        sequence.order = index
        newIncorrectSequences[sequence.key] = sequence
      })
      dispatch(questionActions.updateIncorrectSequences(questionID, newIncorrectSequences))
      alert('Saved!')
    } else {
      alert('No changes to incorrect sequence order have been made.')
    }
  }

  saveSequencesAndFeedback = (key) => {
    const { actionFile } = this.state
    const { submitEditedIncorrectSequence, deleteIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { incorrectSequences } = this.state
    const filteredSequences = this.removeEmptySequences(incorrectSequences)
    let data = filteredSequences[key]
    delete data.conceptResults.null;
    if (data.text === '') {
      delete filteredSequences[index]
      dispatch(deleteIncorrectSequence(questionID, key));
    } else if (data.text.split('|||').some(sequence => !isValidRegex(sequence))) {
      alert('Your regex syntax is invalid. Try again!')
    } else {
      dispatch(submitEditedIncorrectSequence(questionID, data, key));
    }
    this.setState({incorrectSequences: filteredSequences})
  };

  removeEmptySequences = (sequences) => {
    return _.mapObject(sequences, (val) => (
      Object.assign({}, val, {
        text: val.text.split(/\|{3}(?!\|)/).filter(val => val !== '').join('|||')
      })
    )
    );
  }

  addNewSequence = (e, key) => {
    const { incorrectSequences } = this.state
    const className = `regex-${key}`
    const value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    incorrectSequences[key].text = value;
    this.setState({incorrectSequences: incorrectSequences})
  }

  handleSequenceChange = (e, key) => {
    const { incorrectSequences } = this.state
    const className = `regex-${key}`
    const value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}`;
    if (value === '') {
      if (!confirm("Deleting this regex will delete the whole incorrect sequence. Are you sure you want that?")) {
        return
      }
    }
    incorrectSequences[key].text = value;
    this.setState({incorrectSequences: incorrectSequences})
  }

  handleNameChange = (e, key) => {
    const { incorrectSequences } = this.state
    incorrectSequences[key].name = e.target.value
    this.setState({incorrectSequences: incorrectSequences})
  }

  handleFeedbackChange = (e, key) => {
    const { incorrectSequences } = this.state
    incorrectSequences[key].feedback = e
    this.setState({incorrectSequences: incorrectSequences})
  }

  inputElement = (className, text, key) => {
    return <input className={className} onChange={(e) => this.handleSequenceChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
  }

  renderConceptResults = (concepts, sequenceKey) => {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p className="control sub-title is-6" key={`${val.name}`}>{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
            : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" onClick={() => this.deleteConceptResult(key, sequenceKey)} style={{ cursor: 'pointer', marginLeft: 5, }}>Delete</span>
        </p>
      )
      );
      return _.values(components);
    }
  }

  renderSaveButton() {
    return (
      <button className="button is-outlined is-primary" onClick={this.handleSaveAllSequences} style={{ float: 'right', }} type="button">Save Sequences</button>
    );
  }

  renderSequenceList = () => {
    const { match } = this.props

    const components = this.sequencesSortedByOrder().map((sequence) => {
      return (
        <div className="card is-fullwidth has-bottom-margin" id={sequence.key} key={sequence.key} >
          <header className="card-header">
            <input className="regex-name" onChange={(e) => this.handleNameChange(e, sequence.key)} placeholder="Name" type="text" value={sequence.name || ''} />
          </header>
          <header className="card-header">
            <p className="card-header-title" style={{ display: 'inline-block', }}>
              {this.renderTextInputFields(sequence.text, sequence.key)}
              <button className="add-regex-button" onClick={(e) => this.addNewSequence(e, sequence.key)} type="button">+</button>
            </p>
            <p className="card-header-icon">
              {sequence.order}
            </p>
          </header>
          <div className="card-content">
            <label className="label" htmlFor="feedback" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={(e) => this.handleFeedbackChange(e, sequence.key)}
              key="feedback"
              shouldCheckSpelling={true}
              text={sequence.feedback}
            />
            <br />
            {this.renderConceptResults(sequence.conceptResults, sequence.key)}
          </div>
          <footer className="card-footer">
            <NavLink className="card-footer-item" to={`${match.url}/${sequence.key}/edit`}>Edit</NavLink>
            <a className="card-footer-item" onClick={() => this.deleteSequence(sequence.key)}>Delete</a>
          </footer>
        </div>
      )
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  renderTextInputFields = (sequenceString, key) => {
    const className = `input regex-inline-edit regex-${key}`
    if (sequenceString === '') return this.inputElement(className, '', key)
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      this.inputElement(className, text, key)
    ));
  }

  renderSaveOrderButton() {
    const { orderedIds } = this.state
    return (
      orderedIds ? <button className="button is-outlined is-primary" onClick={this.updateOrder} style={{ float: 'right', }}>Save Sequence Order</button> : null
    );
  }

  render() {
    const { match } = this.props
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`#${match.url}/new`} rel="noopener noreferrer" style={{ float: 'right', }}>Add Incorrect Sequence</a>
          {this.renderSaveButton()}
        </div>
        {this.renderSequenceList()}
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
  return Object.assign(mapState, { generatedIncorrectSequences: props.generatedIncorrectSequences })
};

export default connect(select)(IncorrectSequencesContainer);
