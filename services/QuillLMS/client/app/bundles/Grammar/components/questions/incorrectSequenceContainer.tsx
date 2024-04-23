import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { v4 as uuid } from 'uuid';

import { hashToCollection, SortableList, TextEditor } from '../../../Shared/index';
import * as questionActions from '../../actions/questions';

class IncorrectSequencesContainer extends React.Component {

  constructor(props) {
    super(props);
    const { questions, match } = this.props

    const question = questions.data[match.params.questionID]
    const incorrectSequences = question.incorrectSequences

    const sequencesCollection = hashToCollection(incorrectSequences)
    const orderedIds = sequencesCollection.sort((a, b) => a.order - b.order).map(b => b.key);

    this.state = { orderedIds: orderedIds, incorrectSequences: incorrectSequences, }
  }

  UNSAFE_componentWillMount() {
    const { dispatch, match, } = this.props
    dispatch(questionActions.getUsedSequences(match.params.questionID))
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

  deleteSequence = (sequenceID: string) => {
    const { incorrectSequences, orderedIds } = this.state
    const { dispatch, match, } = this.props
    const { params } = match;
    const { questionID } = params;

    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(questionActions.deleteIncorrectSequence(match.params.questionID, sequenceID));
      delete incorrectSequences[sequenceID]
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
  }

  deleteConceptResult(conceptResultKey: string, sequenceKey: string) {
    const { dispatch, match, } = this.props
    const { incorrectSequences } = this.state
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = incorrectSequences[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(questionActions.submitEditedIncorrectSequence(match.params.questionID, data, sequenceKey));
    }
  }

  handleDeleteConceptResult = (key, sequenceKey) => {
    this.deleteConceptResult(key, sequenceKey)
  }

  handleDeleteSequence = (key) => {
    this.deleteSequence(key)
  }

  saveSequencesAndFeedback = (key) => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { incorrectSequences } = this.state
    const filteredSequences = this.removeEmptySequences(incorrectSequences)
    let data = filteredSequences[key]
    delete data.conceptResults.null;
    if (data.text === '') {
      delete filteredSequences[key]
      dispatch(questionActions.deleteIncorrectSequence(questionID, key));
    } else {
      dispatch(questionActions.submitEditedIncorrectSequence(questionID, data, key));
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

  handleNameChange = (e, key) => {
    const { incorrectSequences } = this.state
    incorrectSequences[key].name = e.target.value
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

  handleFeedbackChange = (e, key) => {
    const { incorrectSequences } = this.state
    incorrectSequences[key].feedback = e
    this.setState({incorrectSequences: incorrectSequences})
  }

  inputElement = (className, text, key) => {
    return <input className={className} onChange={(e) => this.handleSequenceChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
  }

  sequencesSortedByOrder = () => {
    const { orderedIds, incorrectSequences } = this.state

    const sequencesCollection = hashToCollection(incorrectSequences)
    return orderedIds.map(id => sequencesCollection.find(s => s.key === id))
  }

  sortCallback = sortInfo => {
    const orderedIds = sortInfo.map(item => item.key);
    this.setState({ orderedIds });
  }

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

  renderConceptResults(concepts, sequenceKey: string) {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p className="control sub-title is-6" key={`${val.name}`}>{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
            : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <button className="tag is-small is-warning" onClick={() => this.handleDeleteConceptResult(key, sequenceKey)} style={{ cursor: 'pointer', marginLeft: 5, }} type="button">Delete</button>
        </p>
      )
      );
      return _.values(components);
    }
  }

  renderTextInputFields = (sequenceString, key) => {
    const className = `input regex-inline-edit regex-${key}`
    if (sequenceString === '') return this.inputElement(className, '', key)
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      this.inputElement(className, text, key)
    ));
  }

  renderSaveButton() {
    return (
      <button className="button is-outlined is-primary" onClick={this.handleSaveAllSequences} style={{ float: 'right', }} type="button">Save Sequences</button>
    );
  }

  renderSequenceList() {
    const { match } = this.props
    const components = this.sequencesSortedByOrder().map((seq) => {
      const onClickDelete = () => { this.handleDeleteSequence(seq.key) }
      return (
        <div className="card is-fullwidth has-bottom-margin" id={seq.key} key={seq.key}>
          <header className="card-header">
            <input className="regex-name" onChange={(e) => this.handleNameChange(e, seq.key)} placeholder="Name" type="text" value={seq.name || ''} />
          </header>
          <header className="card-header">
            <p className="card-header-title" style={{ display: 'inline-block', }}>
              {this.renderTextInputFields(seq.text, seq.key)}
              <button className="add-regex-button" onClick={(e) => this.addNewSequence(e, seq.key)} type="button">+</button>
            </p>
            <p className="card-header-icon">
              {seq.order}
            </p>
          </header>
          <div className="card-content">
            <label className="label" htmlFor="feedback" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={(e) => this.handleFeedbackChange(e, seq.key)}
              key="feedback"
              text={seq.feedback}
            />
            <br />
            {this.renderConceptResults(seq.conceptResults, seq.key)}
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" href={`/grammar/#/admin/questions/${match.params.questionID}/incorrect-sequences/${seq.key}/edit`}>Edit</a>
            <button className="card-footer-item" onClick={onClickDelete} type="button">Delete</button>
          </footer>
        </div>
      )});
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  render() {
    const { children, match, } = this.props
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/grammar/#/admin/questions/${match.params.questionID}/incorrect-sequences/new`} rel="noopener noreferrer" style={{ float: 'right', }}>Add Incorrect Sequence</a>
          {this.renderSaveButton()}
        </div>
        {this.renderSequenceList()}
        {children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences
  };
}

export default connect(select)(IncorrectSequencesContainer);
