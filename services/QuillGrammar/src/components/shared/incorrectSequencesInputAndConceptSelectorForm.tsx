import * as React from 'react';
import * as _ from 'underscore';
import { isValidRegex } from 'quill-component-library/dist/componentLibrary'
import * as request from 'request'
import { EditorState, ContentState } from 'draft-js'

import ConceptSelectorWithCheckbox from './conceptSelectorWithCheckbox';
import TextEditor from './textEditor';
import ResponseComponent from '../questions/responseComponent'

export default class IncorrectSequencesInputAndConceptSelectorForm extends React.Component {
  constructor(props) {
    super(props)

    const { item } = props

    this.state = {
      itemText: item ? `${item.text}|||` : '',
      itemFeedback: item ? item.feedback : '',
      itemConcepts: item ? (item.conceptResults ? item.conceptResults : {}) : {},
      caseInsensitive: item ? (item.caseInsensitive ? item.caseInsensitive : false) : false,
      matchedCount: 0
    }

    this.getNewAffectedCount = this.getNewAffectedCount.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleConceptChange = this.handleConceptChange.bind(this)
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this)
    this.deleteConceptResult = this.deleteConceptResult.bind(this)
    this.toggleCheckboxCorrect = this.toggleCheckboxCorrect.bind(this)
    this.handleToggleQuestionCaseInsensitive = this.handleToggleQuestionCaseInsensitive.bind(this)
  }

  addOrEditItemLabel() {
    return this.props.item ? `Edit ${this.props.itemLabel}` : `Add New ${this.props.itemLabel}`;
  }

  getNewAffectedCount() {
    const qid = this.props.questionID
    const usedSeqs = this.props.usedSequences
    const newSeqs = this.state.itemText.split(/\|{3}(?!\|)/)
    request(
      {
        url: `${process.env.QUILL_CMS}/responses/${qid}/incorrect_sequence_affected_count`,
        method: 'POST',
        json: {data: {used_sequences: usedSeqs, selected_sequences: newSeqs}}
      },
      (err, httpResponse, data) => {
        this.setState({matchedCount: data.matchedCount})
      }
    );
  }

  handleChange(stateKey, e) {
    const obj = {};
    let value = e.target.value;
    if (stateKey === 'itemText') {
      value = `${Array.from(document.getElementsByClassName('focus-point-text')).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    }
    obj[stateKey] = value;
    this.setState(obj);
  }

  handleConceptChange(e) {
    const concepts = this.state.itemConcepts;
    if (!concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = { correct: false, name: e.label, conceptUID: e.value, };
      this.setState({
        itemConcepts: concepts,
      });
    }
  }

  handleFeedbackChange(e) {
    this.setState({itemFeedback: e})
  }

  submit(incorrectSequence) {
    const { itemFeedback, itemConcepts, caseInsensitive, itemText } = this.state
    const incorrectSequences = itemText.split(/\|{3}(?!\|)/).filter(val => val !== '')

    if (incorrectSequences.every(is => isValidRegex(is))) {
      const incorrectSequenceString = incorrectSequences.join('|||')
      const data = {
        text: incorrectSequenceString,
        feedback: itemFeedback,
        conceptResults: itemConcepts,
        caseInsensitive: caseInsensitive ? caseInsensitive : false,
      };
      this.props.onSubmit(data, incorrectSequence);
    } else {
      window.alert('Your regex syntax is invalid. Try again!')
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

  deleteConceptResult(key) {
    const newConceptResults = Object.assign({}, this.state.itemConcepts)
    delete newConceptResults[key]
    this.setState({itemConcepts: newConceptResults})
  }

  toggleCheckboxCorrect(key) {
    const data = this.state;
    data.itemConcepts[key].correct = !data.itemConcepts[key].correct;
    this.setState(data);
  }

  returnAppropriateDataset() {
    const questionID = this.props.questionID
    let theDatasetYouAreLookingFor = this.props.questions.data[questionID];
    let mode = 'questions';
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  }

  handleToggleQuestionCaseInsensitive() {
    const data = this.state;
    data.caseInsensitive = !data.caseInsensitive;
    this.setState(data);
  }

  renderExplanatoryNote() {
    return (<div style={{ marginBottom: '10px' }}>
      <p>Incorrect sequences can contain regular expressions. See <a href="https://www.regextester.com/">this page</a> to test regular expressions, and access the cheat sheet on the right. <b>Note:</b> any periods need to be prefaced with a backslash ("\") in order to be evaluated correctly. Example: "walked\."</p>
      <br />
      <p>In order to indicate that two or more words or phrases must appear in the response together, you can separate them using "&&". Example: "running&&dancing&&swimming", "run&&dance&&swim".</p>
    </div>)
  }

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    const { caseInsensitive } = this.state;
    return (
      <div>
        <div className="box add-incorrect-sequence">
          <h4 className="title">{this.addOrEditItemLabel()}</h4>
          {this.renderExplanatoryNote()}
          <div className="control">
            <label className="label">{this.props.itemLabel} Text</label>
            {this.renderTextInputFields()}
            <label className="label" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={this.handleFeedbackChange}
              key={"feedback"}
              text={this.state.itemFeedback || ""}
            />
            <label className="label" style={{ marginTop: 10, }}>Concepts</label>
            {this.renderConceptSelectorFields()}
            <p className="control checkbox-wrapper">
              <input checked={caseInsensitive} className="checkbox" id="case-insensitive" onClick={this.handleToggleQuestionCaseInsensitive} type="checkbox" />
              <label className="label checkbox-label" htmlFor="case-insensitive">Case Insensitive?</label>
            </p>
          </div>
          <p className="control">
            <button className={'button is-primary '} onClick={() => this.submit(this.props.item ? this.props.item.id : null)}>Submit</button>
            <button className={'button is-outlined is-info'} onClick={() => window.history.back()} style={{ marginLeft: 5, }}>Cancel</button>
          </p>
        </div>
        <div>
          <label className="label">{this.state.matchedCount} {this.state.matchedCount === 1 ? 'sequence' : 'sequences'} affected</label>
          <ResponseComponent
            mode={mode}
            question={dataset}
            questionID={this.props.questionID}
            selectedIncorrectSequences={this.state.itemText.split(/\|{3}(?!\|)/)}
            states={this.props.questions.states}
          />
        </div>
      </div>
    );
  }

}
