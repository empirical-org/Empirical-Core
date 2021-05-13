import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import _ from 'underscore';
import { SortableList } from '../../../Shared/index';

import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

class IncorrectSequencesContainer extends Component {
  constructor(props) {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions
    const question = props[questionType].data[props.match.params.questionID]
    const incorrectSequences = this.getSequences(question)

    this.state = { questionType, actionFile, questionTypeLink, incorrectSequences };
  }

  componentDidMount() {
    const { actionFile } = this.state
    const { getUsedSequences } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (getUsedSequences) {
      dispatch(getUsedSequences(questionID))
    }
  }

  getSequences = (question) => {
    const sequences = question.incorrectSequences;
    if(sequences && sequences.length) {
      return sequences.filter(incorrectSequence => incorrectSequence)
    } else {
      return sequences
    }
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
      dispatch(submitEditedIncorrectSequence(questionID, data, sequenceKey));
    }
  }

  deleteSequence = sequenceID => {
    const { actionFile } = this.state
    const { deleteIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(deleteIncorrectSequence(questionID, sequenceID));
    }
  };

  sortCallback = sortInfo => {
    const { actionFile, incorrectSequences } = this.state
    const { updateIncorrectSequences } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const newOrder = sortInfo.filter(item => item).map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    dispatch(updateIncorrectSequences(questionID, newIncorrectSequences));
  };

  saveSequence = (key) => {
    const { actionFile } = this.state
    const { submitEditedIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    const { incorrectSequences } = this.state
    let data = incorrectSequences[key]
    delete data.conceptResults.null;
    dispatch(submitEditedIncorrectSequence(questionID, data, key));
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
    const { incorrectSequences } = this.state
    const { match } = this.props

    const components = _.mapObject(incorrectSequences, (val, key) => {
      if (val.text) {
        return (
          <div className="card is-fullwidth has-bottom-margin" key={key}>
            <header className="card-header">
              <p className="card-header-title" style={{ display: 'inline-block', }}>
                {this.renderTextInputFields(val.text, key)}
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
              <NavLink className="card-footer-item" to={`${match.url}/${key}/edit`}>Edit</NavLink>
              <a className="card-footer-item" onClick={() => this.deleteSequence(key)}>Delete</a>
            </footer>
          </div>
        )
      }
    });
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  handleChange = (e, key) => {
    const { incorrectSequences } = this.state
    let value = e.target.value;
    let className = `regex-${key}`
    value = `${Array.from(document.getElementsByClassName(className)).map(i => i.value).filter(val => val !== '').join('|||')}`;
    incorrectSequences[key].text = value;
    this.setState({incorrectSequences: incorrectSequences})
  }

  renderTextInputFields = (sequenceString, key) => {
    let className = `input regex-inline-edit regex-${key}`
    return sequenceString.split(/\|{3}(?!\|)/).map(text => (
      <input className={className} onBlur={(e) => this.saveSequence(key)} onChange={(e) => this.handleChange(e, key)} style={{ marginBottom: 5, minWidth: `${(text.length + 1) * 8}px`}} type="text" value={text || ''} />
    ));
  }

  render() {
    const { match } = this.props
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`#${match.url}/new`} rel="noopener noreferrer" style={{ float: 'right', }} target="_blank">Add Incorrect Sequence</a>
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
