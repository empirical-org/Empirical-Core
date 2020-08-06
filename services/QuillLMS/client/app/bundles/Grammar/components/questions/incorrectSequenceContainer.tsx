import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as questionActions from '../../actions/questions';
import SortableList from '../shared/sortableList';

class IncorrectSequencesContainer extends React.Component {

  UNSAFE_componentWillMount() {
    const { dispatch, match, } = this.props
    dispatch(questionActions.getUsedSequences(match.params.questionID))
  }

  getQuestion() {
    const { match, questions, } = this.props
    return questions.data[match.params.questionID];
  }

  getSequences() {
    return this.getQuestion().incorrectSequences;
  }

  submitSequenceForm = (data, sequence) => {
    const { dispatch, match, } = this.props
    delete data.conceptResults.null;
    if (sequence) {
      dispatch(questionActions.submitEditedIncorrectSequence(match.params.questionID, data, sequence));
    } else {
      dispatch(questionActions.submitNewIncorrectSequence(match.params.questionID, data));
    }
  }

  deleteSequence = (sequenceID: string) => {
    const { dispatch, match, } = this.props
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      dispatch(questionActions.deleteIncorrectSequence(match.params.questionID, sequenceID));
    }
  }

  deleteConceptResult(conceptResultKey: string, sequenceKey: string) {
    const { dispatch, match, } = this.props
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      dispatch(questionActions.submitEditedIncorrectSequence(match.params.questionID, data, sequenceKey));
    }
  }

  renderTagsForSequence(sequenceString: string) {
    return sequenceString.split('|||').map((seq, index) => (<span className="tag is-medium is-light" key={`seq${index}`} style={{ margin: '3px', }}>{seq}</span>));
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

  handleDeleteConceptResult = (key, sequenceKey) => {
    this.deleteConceptResult(key, sequenceKey)
  }

  handleDeleteSequence = (key) => {
    this.deleteSequence(key)
  }

  renderSequenceList() {
    const { match, } = this.props
    const components = _.mapObject(this.getSequences(), (val, key) => {
      const onClickDelete = () => { this.handleDeleteSequence(key) }
      return (<div className="card is-fullwidth has-bottom-margin" key={key}>
        <header className="card-header">
          <p className="card-header-title" style={{ display: 'inline-block', }}>
            {this.renderTagsForSequence(val.text)}
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
    const { dispatch, match, } = this.props
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    dispatch(questionActions.updateIncorrectSequences(match.params.questionID, newIncorrectSequences))
  }

  render() {
    const { children, match, } = this.props
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/grammar/#/admin/questions/${match.params.questionID}/incorrect-sequences/new`} style={{ float: 'right', }}>Add Incorrect Sequence</a>
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
