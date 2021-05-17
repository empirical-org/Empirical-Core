import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as questionActions from '../../actions/questions';

import { SortableList, } from '../../../Shared/index';
import dispatch from '../../../Comprehension/__mocks__/dispatch';

class IncorrectSequencesContainer extends React.Component {

  constructor(props) {
    super();

    const question = this.props.questions.data[this.props.match.params.questionID]
    this.state = { incorrectSequences: question.incorrectSequences }
  }

  UNSAFE_componentWillMount() {
    const { dispatch, match, } = this.props
    dispatch(questionActions.getUsedSequences(match.params.questionID))
  }

  deleteSequence = (sequenceID: string) => {
    const { incorrectSequences } = this.state
    const { dispatch, match, } = this.props
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(questionActions.deleteIncorrectSequence(match.params.questionID, sequenceID));
      delete incorrectSequences[sequenceID]
      this.setState({ incorrectSequences: incorrectSequences})
    }
  }

  saveSequence = (sequenceID: string) => {
    const { incorrectSequences } = this.state
    const { match, dispatch } = this.props
    const { params } = match
    const { questionID } = params
    let data = incorrectSequences[sequenceID]
    delete data.conceptResults.null;
    dispatch(questionActions.submitEditedIncorrectSequence(questionID, data, sequenceID))
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

  handleDeleteConceptResult = (key, sequenceKey) => {
    this.deleteConceptResult(key, sequenceKey)
  }

  handleDeleteSequence = (key) => {
    this.deleteSequence(key)
  }

  renderSequenceList() {
    const { incorrectSequences } = this.state
    const { match } = this.props
    const components = _.mapObject(incorrectSequences, (val, key) => {
      const onClickDelete = () => { this.handleDeleteSequence(key) }
      return (<div className="card is-fullwidth has-bottom-margin" key={key}>
        <header className="card-header">
          <p className="card-header-title" style={{ display: 'inline-block', }}>
            {this.renderTextInputFields(val.text, key)}
          </p>
          <p className="card-header-icon">
            {val.order}
          </p>
        </header>
        <div className="card-content">
          <p className="control" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + val.feedback + '<br/>'}} />
          {this.renderConceptResults(val.conceptResults, key)}
        </div>
        <footer className="card-footer">
          <a className="card-footer-item" href={`/grammar/#/admin/questions/${match.params.questionID}/incorrect-sequences/${key}/edit`}>Edit</a>
          <button className="card-footer-item" onClick={onClickDelete} type="button">Delete</button>
        </footer>
      </div>
    )});
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  sortCallback = (sortInfo) => {
    const { incorrectSequences } = this.state
    const { dispatch, match, } = this.props
    const newOrder = sortInfo.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    dispatch(questionActions.updateIncorrectSequences(match.params.questionID, newIncorrectSequences))
    this.setState({incorrectSequences: newIncorrectSequences})
  }

  render() {
    const { children, match, } = this.props
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/grammar/#/admin/questions/${match.params.questionID}/incorrect-sequences/new`} rel="noopener noreferrer" style={{ float: 'right', }} target="_blank">Add Incorrect Sequence</a>
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
