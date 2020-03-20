import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import {
  hashToCollection,
  SortableList
} from 'quill-component-library/dist/componentLibrary';
import request from 'request'

class IncorrectSequencesContainer extends Component {
  componentWillMount() {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    dispatch(questionActions.getUsedSequences(questionID))
  }

  getQuestion() {
    const { params, questions } = this.props;
    const { data } = questions;
    const { questionID } = params;
    return data[questionID];
  }

  getSequences() {
    return this.getQuestion().incorrectSequences;
  }

  submitSequenceForm = (data, sequence) => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    delete data.conceptResults.null;
    if (sequence) {
      dispatch(questionActions.submitEditedIncorrectSequence(questionID, data, sequence));
    } else {
      dispatch(questionActions.submitNewIncorrectSequence(questionID, data));
    }
  };

  deleteSequence = sequenceID => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(questionActions.deleteIncorrectSequence(questionID, sequenceID));
    }
  };

  deleteConceptResult(conceptResultKey, sequenceKey) {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(questionActions.submitEditedIncorrectSequence(questionID, data, sequenceKey));
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
    const { params } = this.props;
    const { questionID } = params;
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
          <a className="card-footer-item" href={`/#/admin/questions/${questionID}/incorrect-sequences/${key}/edit`}>Edit</a>
          <a className="card-footer-item" onClick={() => this.deleteSequence(key)}>Delete</a>
        </footer>
      </div>
    ));
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  sortCallback = sortInfo => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    dispatch(questionActions.updateIncorrectSequences(questionID, newIncorrectSequences));
  };

  render() {
    const { children, params } = this.props;
    const { questionID } = params;
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/#/admin/questions/${questionID}/incorrect-sequences/new`} style={{ float: 'right', }}>Add Incorrect Sequence</a>
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
