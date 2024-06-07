import * as _ from 'underscore';
import * as React from 'react';

import { requestPost, } from '../../../../modules/request/index';
import { TextEditor, isValidFocusPointOrIncorrectSequence, ConceptSelectorWithCheckbox, } from '../../../Shared/index';

export class IncorrectSequencesInputAndConceptSelectorForm extends React.Component {
  constructor(props) {
    super(props)

    const { item } = props

    this.state = {
      name: item ? (item.name ? item.name : '') : '',
      itemText: item ? `${item.text}|||` : '',
      itemFeedback: item ? item.feedback : '',
      itemConcepts: item ? (item.conceptResults ? item.conceptResults : {}) : {},
      caseInsensitive: item ? (item.caseInsensitive ? item.caseInsensitive : false) : true,
      matchedCount: 0
    }
  }

  addOrEditItemLabel() {
    return this.props.item ? `Edit ${this.props.itemLabel}` : `Add New ${this.props.itemLabel}`;
  }

  getNewAffectedCount = () => {
    const qid = this.props.questionID
    const usedSeqs = this.props.usedSequences
    const newSeqs = this.state.itemText.split(/\|{3}(?!\|)/)
    requestPost(
      `${process.env.QUILL_CMS}/responses/${qid}/incorrect_sequence_affected_count`,
      {data: {used_sequences: usedSeqs, selected_sequences: newSeqs}},
      (body) => {
        this.setState({matchedCount: body.matchedCount})
      }
    )
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }

  handleChange = (stateKey, e) => {
    const obj = {};
    let value = e.target.value;
    if (stateKey === 'itemText') {
      value = `${Array.from(document.getElementsByClassName('focus-point-text')).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    }
    obj[stateKey] = value;
    this.setState(obj);
  }

  handleConceptChange = (e) => {
    const concepts = this.state.itemConcepts;
    if (!concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = { correct: false, name: e.label, conceptUID: e.value, };
      this.setState({
        itemConcepts: concepts,
      });
    }
  }

  handleFeedbackChange = (e) => {
    this.setState({itemFeedback: e})
  }

  submit(incorrectSequence) {
    const { name, itemFeedback, itemConcepts, caseInsensitive, itemText } = this.state
    const incorrectSequences = itemText.split(/\|{3}(?!\|)/).filter(val => val !== '')

    if (incorrectSequences.every(is => isValidFocusPointOrIncorrectSequence(is))) {
      const incorrectSequenceString = incorrectSequences.join('|||')
      const data = {
        name: name,
        text: incorrectSequenceString,
        feedback: itemFeedback,
        conceptResults: itemConcepts,
        caseInsensitive: caseInsensitive || false,
      };
      this.props.onSubmit(data, incorrectSequence);
    } else {
      window.alert('Your incorrect sequence is invalid. Check your regex syntax and try again!')
    }
  }

  renderTextInputFields() {
    return this.state.itemText.split(/\|{3}(?!\|)/).map(text => (
      <input className="input focus-point-text" onBlur={this.getNewAffectedCount} onChange={this.handleChange.bind(null, 'itemText')} style={{ marginBottom: 5, }} type="text" value={text || ''} />
    ));
  }

  renderConceptSelectorFields() {
    const components = _.mapObject(Object.assign({}, this.state.itemConcepts, { null: { correct: false, text: 'This is a placeholder', }, }), (val, key) => (
      <ConceptSelectorWithCheckbox
        checked={val.correct}
        currentConceptUID={key}
        deleteConceptResult={() => this.deleteConceptResult(key)}
        handleSelectorChange={this.handleConceptChange}
        onCheckboxChange={() => this.toggleCheckboxCorrect(key)}
        selectorDisabled={key === 'null' ? false : true}
      />
    ));
    return _.values(components);
  }

  deleteConceptResult = (key) => {
    const newConceptResults = Object.assign({}, this.state.itemConcepts)
    delete newConceptResults[key]
    this.setState({itemConcepts: newConceptResults})
  }

  toggleCheckboxCorrect = (key) => {
    const data = this.state;
    data.itemConcepts[key].correct = !data.itemConcepts[key].correct;
    this.setState(data);
  }

  returnAppropriateDataset = () => {
    const { questionID, questions, } = this.props
    const datasets = ['fillInBlank', 'sentenceFragments'];
    let theDatasetYouAreLookingFor = questions.data[questionID];
    let mode = 'questions';
    datasets.forEach((dataset) => {
      if (this.props[dataset]?.data && this.props[dataset].data[questionID]) {
        theDatasetYouAreLookingFor = this.props[dataset].data[questionID];
        mode = dataset;
      }
    });
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  };

  handleToggleQuestionCaseInsensitive = () => {
    this.setState(prevState => ({caseInsensitive: !prevState.caseInsensitive}));
  }

  renderExplanatoryNote() {
    return (
      <div style={{ marginBottom: '10px' }}>
        <p>Incorrect sequences can contain regular expressions. See <a href="https://www.regextester.com/">this page</a> to test regular expressions, and access the cheat sheet on the right. <b>Note:</b> any periods need to be prefaced with a backslash ("\") in order to be evaluated correctly. Example: "walked\."</p>
        <br />
        <p>In order to indicate that two or more words or phrases must appear in the response together, you can separate them using "&&". Example: "running&&dancing&&swimming", "run&&dance&&swim". Please note that "&&" cannot be used inside of capture groups (ie, parentheses).</p>
      </div>
    )
  }

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    const { caseInsensitive, name, itemFeedback, } = this.state;
    const { ResponseComponent, } = this.props

    return (
      <div>
        <div className="box add-incorrect-sequence">
          <h4 className="title">{this.addOrEditItemLabel()}</h4>
          {this.renderExplanatoryNote()}
          <div className="control">
            <label className="label">Name</label>
            <input className="input" onChange={this.handleNameChange} type="text" value={name || ''} />
            <label className="label">{this.props.itemLabel} Text</label>
            {this.renderTextInputFields()}
            <label className="label" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              handleTextChange={this.handleFeedbackChange}
              key="feedback"
              text={itemFeedback || ""}
            />
            <label className="label" style={{ marginTop: 10, }}>Concepts</label>
            {this.renderConceptSelectorFields()}
            <p className="control checkbox-wrapper">
              <input checked={caseInsensitive} className="checkbox" id="case-insensitive" onClick={this.handleToggleQuestionCaseInsensitive} type="checkbox" />
              <label className="label checkbox-label" htmlFor="case-insensitive">Case Insensitive?</label>
            </p>
          </div>
          <p className="control">
            <button className="button is-primary " onClick={() => this.submit(this.props.item ? this.props.item.id : null)}>Submit</button>
            <button className="button is-outlined is-info" onClick={() => window.history.back()} style={{ marginLeft: 5, }}>Cancel</button>
          </p>
        </div>
        <div>
          <label className="label">At least {this.state.matchedCount} {this.state.matchedCount === 1 ? 'sequence' : 'sequences'} affected</label>
          <ResponseComponent
            mode={mode}
            question={dataset}
            questionID={this.props.questionID}
            selectedIncorrectSequences={this.state.itemText.split(/\|{3}(?!\|)/)}
            states={this.props.states}
          />
        </div>
      </div>
    );
  }

}
