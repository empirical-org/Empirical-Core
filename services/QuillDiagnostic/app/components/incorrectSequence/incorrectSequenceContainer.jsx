import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import { SortableList } from 'quill-component-library/dist/componentLibrary';

class IncorrectSequencesContainer extends Component {
  constructor(props) {
    super(props);

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions
    const { sentenceFragments } = props

    this.state = {
      questionType: questionType,
      actionFile: actionFile,
      questionTypeLink: questionTypeLink,
      sentenceFragments: sentenceFragments
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

  getQuestion() {
    const { match, questions } = this.props;
    const { params } = match;
    const { data } = questions;
    const { questionID } = params;
    return data[questionID];
  }

  getSequences() {
    return this.getQuestion().incorrectSequences;
  }

  submitSequenceForm = (data, sequence) => {
    const { match } = this.props;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    const { actionFile } = this.state;
    if (sequence) {
      dispatch(actionFile.submitEditedIncorrectSequence(questionID, data, sequence));
    } else {
      dispatch(actionFile.submitNewIncorrectSequence(questionID, data));
    }
  };

  deleteSequence = sequenceID => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(actionFile.deleteIncorrectSequence(questionID, sequenceID));
    }
  };

  deleteConceptResult(conceptResultKey, sequenceKey) {
    const { actionFile } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(actionFile.submitEditedIncorrectSequence(questionID, data, sequenceKey));
    }
  }

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
          <a className="card-footer-item" href={`/#/admin/${path}/${questionID}/incorrect-sequences/${key}/edit`}>Edit</a>
          <a className="card-footer-item" onClick={() => this.deleteSequence(key)}>Delete</a>
        </footer>
      </div>
    ));
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  sortCallback = sortInfo => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    dispatch(actionFile.updateIncorrectSequences(questionID, newIncorrectSequences));
  };

  render() {
    const { match } = this.props;
    const { params, url } = match;
    const { questionID } = params;
    const path = url.includes('sentence-fragments') ? 'sentence-fragments' : 'questions'
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/#/admin/${path}/${questionID}/incorrect-sequences/new`} style={{ float: 'right', }}>Add Incorrect Sequence</a>
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
