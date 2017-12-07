import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import { hashToCollection } from '../../libs/hashToCollection';
import SortableList from '../questions/sortableList/sortableList.jsx';
import request from 'request'

class IncorrectSequencesContainer extends Component {
  constructor() {
    super();

    this.deleteSequence = this.deleteSequence.bind(this);
    this.submitSequenceForm = this.submitSequenceForm.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(questionActions.getSuggestedSequences(this.props.params.questionID))
  }

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  getSequences() {
    return this.getQuestion().incorrectSequences;
  }

  submitSequenceForm(data, sequence) {
    delete data.conceptResults.null;
    if (sequence) {
      this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.params.questionID, data, sequence));
    } else {
      this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.params.questionID, data));
    }
  }

  deleteSequence(sequenceID) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteIncorrectSequence(this.props.params.questionID, sequenceID));
    }
  }

  deleteConceptResult(conceptResultKey, sequenceKey) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.params.questionID, data, sequenceKey));
    }
  }

  renderTagsForSequence(sequenceString) {
    return sequenceString.split('|||').map((seq, index) => (<span key={`seq${index}`} className="tag is-medium is-light" style={{ margin: '3px', }}>{seq}</span>));
  }

  renderConceptResults(concepts, sequenceKey) {
    if (concepts) {
      const components = _.mapObject(concepts, (val, key) => (
        <p key={`${val.name}`}className="control sub-title is-6">{val.name}
          {val.correct ? <span className="tag is-small is-success" style={{ marginLeft: 5, }}>Correct</span>
          : <span className="tag is-small is-danger" style={{ marginLeft: 5, }}>Incorrect</span> }
          <span className="tag is-small is-warning" style={{ cursor: 'pointer', marginLeft: 5, }} onClick={() => this.deleteConceptResult(key, sequenceKey)}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }

  renderSequenceList() {
    const components = _.mapObject(this.getSequences(), (val, key) => (
      <div key={key} className="card is-fullwidth has-bottom-margin">
        <header className="card-header">
          <p className="card-header-title" style={{ display: 'inline-block', }}>
            {this.renderTagsForSequence(val.text)}
          </p>
          <p className="card-header-icon">
            {val.order}
          </p>
        </header>
        <div className="card-content">
          <p className="control title is-4" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + val.feedback, }} />
          {this.renderConceptResults(val.conceptResults, key)}
        </div>
        <footer className="card-footer">
          <a href={`/#/admin/questions/${this.props.params.questionID}/incorrect-sequences/${key}/edit`} className="card-footer-item">Edit</a>
          <a onClick={() => this.deleteSequence(key)} className="card-footer-item">Delete</a>
        </footer>
      </div>
    ));
    return <SortableList key={_.values(components).length} sortCallback={this.sortCallback} data={_.values(components)} />;
  }

  sortCallback(sortInfo) {
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    questionActions.updateIncorrectSequences(this.props.params.questionID, newIncorrectSequences)
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" style={{ float: 'right', }} href={`/#/admin/questions/${this.props.params.questionID}/incorrect-sequences/new`}>Add Incorrect Sequence</a>
        </div>
        {this.renderSequenceList()}
        {this.props.children}
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
