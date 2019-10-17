import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as questionActions from '../../actions/questions';
import SortableList from '../shared/sortableList';

class IncorrectSequencesContainer extends React.Component {
  constructor() {
    super();

    this.deleteSequence = this.deleteSequence.bind(this);
    this.submitSequenceForm = this.submitSequenceForm.bind(this);
    this.sortCallback = this.sortCallback.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(questionActions.getUsedSequences(this.props.match.params.questionID))
  }

  getQuestion() {
    return this.props.questions.data[this.props.match.params.questionID];
  }

  getSequences() {
    return this.getQuestion().incorrectSequences;
  }

  submitSequenceForm(data, sequence) {
    delete data.conceptResults.null;
    if (sequence) {
      this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.match.params.questionID, data, sequence));
    } else {
      this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.match.params.questionID, data));
    }
  }

  deleteSequence(sequenceID: string) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      this.props.dispatch(questionActions.deleteIncorrectSequence(this.props.match.params.questionID, sequenceID));
    }
  }

  deleteConceptResult(conceptResultKey: string, sequenceKey: string) {
    if (confirm('⚠️ Are you sure you want to delete this? 😱')) {
      const data = this.getSequences()[sequenceKey];
      delete data.conceptResults[conceptResultKey];
      this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.match.params.questionID, data, sequenceKey));
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
          <span className="tag is-small is-warning" onClick={() => this.deleteConceptResult(key, sequenceKey)} style={{ cursor: 'pointer', marginLeft: 5, }}>Delete</span>
        </p>
        )
      );
      return _.values(components);
    }
  }

  renderSequenceList() {
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
          <p className="control" dangerouslySetInnerHTML={{ __html: '<strong>Feedback</strong>: ' + val.feedback + '<br/>'}} />
          {this.renderConceptResults(val.conceptResults, key)}
        </div>
        <footer className="card-footer">
          <a className="card-footer-item" href={`/#/admin/questions/${this.props.match.params.questionID}/incorrect-sequences/${key}/edit`}>Edit</a>
          <a className="card-footer-item" onClick={() => this.deleteSequence(key)}>Delete</a>
        </footer>
      </div>
    ));
    return <SortableList data={_.values(components)} key={_.values(components).length} sortCallback={this.sortCallback} />;
  }

  sortCallback(sortInfo) {
    const incorrectSequences = this.getSequences()
    const newOrder = sortInfo.data.items.map(item => item.key);
    const newIncorrectSequences = newOrder.map((key) => incorrectSequences[key])
    questionActions.updateIncorrectSequences(this.props.match.params.questionID, newIncorrectSequences)
  }

  render() {
    return (
      <div>
        <div className="has-top-margin">
          <h1 className="title is-3" style={{ display: 'inline-block', }}>Incorrect Sequences</h1>
          <a className="button is-outlined is-primary" href={`/#/admin/questions/${this.props.match.params.questionID}/incorrect-sequences/new`} style={{ float: 'right', }}>Add Incorrect Sequence</a>
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
