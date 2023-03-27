import { ContentState, EditorState } from 'draft-js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { hashToCollection, SortableList, TextEditor } from '../../../Shared/index';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';

class IncorrectSequencesContainer extends Component {
  constructor(props) {
    super(props);

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions
    const question = props[questionType].data[props.match.params.questionID]
    const incorrectSequences = this.getSequences(question)
    const { sentenceFragments } = props

    this.state = {
      orderedIds: null,
      questionType: questionType,
      actionFile: actionFile,
      questionTypeLink: questionTypeLink,
      sentenceFragments: sentenceFragments,
      incorrectSequences: incorrectSequences
    };
  }

  UNSAFE_componentWillMount() {
    const { actionFile } = this.state;
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const type = window.location.href.includes('sentence-fragments') ? 'sentence-fragment' : 'sentence-combining'
    dispatch(actionFile.getUsedSequences(questionID, type))
  }

  componentDidUpdate(previousProps, previousState) {
    const question = this.props[this.state.questionType].data[this.props.match.params.questionID]
    const incorrectSequences = this.getSequences(question)

    if (previousState.incorrectSequences === incorrectSequences) return;

    this.setState({ incorrectSequences, });
  }

  getSequences(question) {
    return question.incorrectSequences;
  }

  deleteSequence = sequenceID => {
    const { actionFile, incorrectSequences } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(actionFile.deleteIncorrectSequence(questionID, sequenceID));
      delete incorrectSequences[sequenceID]
      this.setState({incorrectSequences: incorrectSequences})
    }
  };

  deleteConceptResult(conceptResultKey, sequenceKey) {
    const { actionFile, incorrectSequences } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = incorrectSequences[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(actionFile.submitEditedIncorrectSequence(questionID, data, sequenceKey));
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
      delete filteredSequences[key]
      dispatch(deleteIncorrectSequence(questionID, key));
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
    if (orderedIds) {
      const sequencesCollection = hashToCollection(incorrectSequences)
      return orderedIds.map(id => sequencesCollection.find(s => s.key === id))
    } else {
      return hashToCollection(incorrectSequences).sort((a, b) => a.order - b.order);
    }
  }

  sortCallback = sortInfo => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const orderedIds = sortInfo.map(item => item.key);
    this.setState({ orderedIds, });
    dispatch(actionFile.updateIncorrectSequences(questionID, this.sequencesSortedByOrder()));
  };

  renderTagsForSequence(sequenceString) {
    return sequenceString.split('|||').map((seq, index) => (<span className="tag is-medium is-light" key={`seq${index}`} style={{ margin: '3px', }}>{seq}</span>));
  }

  renderConceptResults(concepts, sequenceKey) {
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

  renderSequenceList() {
    const { match } = this.props;
    const { params, url } = match;
    const { questionID } = params;
    const path = url.includes('sentence-fragments') ? 'sentence-fragments' : 'questions'
    const components = this.sequencesSortedByOrder().map((seq) => {
      return (
        <div className="card is-fullwidth has-bottom-margin" key={seq.key}>
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
            <a className="card-footer-item" href={`/diagnostic/#/admin/${path}/${questionID}/incorrect-sequences/${seq.key}/edit`}>Edit</a>
            <a className="card-footer-item" onClick={() => this.deleteSequence(seq.key)}>Delete</a>
            <a className="card-footer-item" onClick={() => this.saveSequencesAndFeedback(seq.key)}>Save</a>
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

  render() {
    const { match } = this.props;
    const { params, url } = match;
    const { questionID } = params;
    const path = url.includes('sentence-fragments') ? 'sentence-fragments' : 'questions'
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/diagnostic/#/admin/${path}/${questionID}/incorrect-sequences/new`} rel="noopener noreferrer" style={{ float: 'right', }}>Add Incorrect Sequence</a>
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
      questions: props.sentenceFragments
    };
  } else {
    mapState = {
      questions: props.questions
    };
  }
  return Object.assign(mapState, { generatedIncorrectSequences: props.generatedIncorrectSequences })
};

export default connect(select)(IncorrectSequencesContainer);
