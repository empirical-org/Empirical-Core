import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { SortableList } from 'quill-component-library/dist/componentLibrary';

import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

class IncorrectSequencesContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, actionFile, questionTypeLink };
  }

  componentDidMount() {
    const { actionFile } = this.state
    const { getUsedSequences } = actionFile
    const { dispatch, params } = this.props
    const { questionID } = params
    if (getUsedSequences) {
      dispatch(getUsedSequences(questionID))
    }
  }

  getQuestion = () => {
    return this.props[this.state.questionType].data[this.props.params.questionID];
  }

  getSequences = () => {
    return this.getQuestion().incorrectSequences;
  }

  deleteConceptResult = (conceptResultKey, sequenceKey) => {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(this.state.actionFile.submitEditedIncorrectSequence(this.props.params.questionID, data, sequenceKey));
    }
  }

  deleteSequence = sequenceID => {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(this.state.actionFile.deleteIncorrectSequence(this.props.params.questionID, sequenceID));
    }
  };

  sortCallback = sortInfo => {
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    this.props.dispatch(this.state.actionFile.updateIncorrectSequences(this.props.params.questionID, newIncorrectSequences));
  };

  submitSequenceForm = (data, sequence) => {
    delete data.conceptResults.null;
    if (sequence) {
      this.props.dispatch(this.state.actionFile.submitEditedIncorrectSequence(this.props.params.questionID, data, sequence));
    } else {
      this.props.dispatch(this.state.actionFile.submitNewIncorrectSequence(this.props.params.questionID, data));
    }
  };

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

  renderSequenceList = () => {
    const components = _.mapObject(this.getSequences(), (val, key) => (
      <div className="card is-fullwidth has-bottom-margin" key={key}>
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
          <a className="card-footer-item" href={`/#/admin/${this.state.questionTypeLink}/${this.props.params.questionID}/incorrect-sequences/${key}/edit`}>Edit</a>
          <a className="card-footer-item" onClick={() => this.deleteSequence(key)}>Delete</a>
        </footer>
      </div>
    ));
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  renderTagsForSequence = (sequenceString) => {
    return sequenceString.split('|||').map((seq, index) => (<span className="tag is-medium is-light" key={`seq${index}`} style={{ margin: '3px', }}>{seq}</span>));
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/#/admin/${this.state.questionTypeLink}/${this.props.params.questionID}/incorrect-sequences/new`} style={{ float: 'right', }}>Add Incorrect Sequence</a>
        </div>
        {this.renderSequenceList()}
        {this.props.children}
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
