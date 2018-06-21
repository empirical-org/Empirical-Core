import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'underscore';
import C from '../../constants';
import ConceptSelectorWithCheckbox from './conceptSelectorWithCheckbox.jsx';
import { TextEditor } from 'quill-component-library/dist/componentLibrary';
import ResponseComponent from '../questions/responseComponent'
import request from 'request'

export default React.createClass({

  propTypes: {
    item: React.PropTypes.obj,
    onSubmit: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    const item = this.props.item;
    return ({
      itemText: item ? `${item.text}|||` : '',
      itemFeedback: item ? item.feedback : '',
      itemConcepts: item ? (item.conceptResults ? item.conceptResults : {}) : {},
      matchedCount: 0
    });
  },

  addOrEditItemLabel() {
    return this.props.item ? `Edit ${this.props.itemLabel}` : `Add New ${this.props.itemLabel}`;
  },

  getNewAffectedCount() {
    const qid = this.props.questionID
    const usedSeqs = this.props.usedSequences
    const newSeqs = this.state.itemText.split('|||')
    request(
      {
        url: `${process.env.QUILL_CMS}/responses/${qid}/affected_count`,
        method: 'POST',
        json: {data: {used_sequences: usedSeqs, selected_sequences: newSeqs}},
      },
      (err, httpResponse, data) => {
        this.setState({matchedCount: data.matchedCount})
        }
      );
    },

  handleChange(stateKey, e) {
    const obj = {};
    let value = e.target.value;
    if (stateKey === 'itemText') {
      value = `${Array.from(document.getElementsByClassName('focus-point-text')).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    }
    obj[stateKey] = value;
    this.setState(obj);
  },

  handleConceptChange(e) {
    const concepts = this.state.itemConcepts;
    if (!concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = { correct: true, name: e.label, conceptUID: e.value, };
      this.setState({
        itemConcepts: concepts,
      });
    }
  },

  handleFeedbackChange(e) {
    this.setState({itemFeedback: e})
  },

  submit(focusPoint) {
    const data = {
      text: this.state.itemText.split('|||').filter(val => val !== '').join('|||'),
      feedback: this.state.itemFeedback,
      conceptResults: this.state.itemConcepts,
    };
    this.props.onSubmit(data, focusPoint);
  },

  renderTextInputFields() {
    return this.state.itemText.split('|||').map(text => (
      <input className="input focus-point-text" style={{ marginBottom: 5, }} onChange={this.handleChange.bind(null, 'itemText')} onBlur={this.getNewAffectedCount} type="text" value={text || ''} />
    ));
  },

  renderConceptSelectorFields() {
    const components = _.mapObject(Object.assign({}, this.state.itemConcepts, { null: { correct: false, text: 'This is a placeholder', }, }), (val, key) => (
      <ConceptSelectorWithCheckbox
        handleSelectorChange={this.handleConceptChange}
        currentConceptUID={key}
        checked={val.correct}
        onCheckboxChange={() => this.toggleCheckboxCorrect(key)}
        selectorDisabled={key === 'null' ? false : true}
        deleteConceptResult={() => this.deleteConceptResult(key)}
      />
    ));
    return _.values(components);
  },

  deleteConceptResult(key) {
    const newConceptResults = Object.assign({}, this.state.itemConcepts)
    delete newConceptResults[key]
    this.setState({itemConcepts: newConceptResults})
  },

  toggleCheckboxCorrect(key) {
    const data = this.state;
    data.itemConcepts[key].correct = !data.itemConcepts[key].correct;
    this.setState(data);
  },

  toggleSuggestedSequence(text) {
    let newIncorrectSequences
    const incorrectSequences = this.state.itemText.split('|||')
    const index = incorrectSequences.indexOf(`${text}`)
    if (index !== -1) {
      incorrectSequences.splice(index, 1).join('|||')
      newIncorrectSequences = incorrectSequences.join('|||')
    } else {
      newIncorrectSequences = incorrectSequences.join('|||') + `${text}|||`
    }
    this.setState({itemText: newIncorrectSequences}, this.getNewAffectedCount)
  },

  returnAppropriateDataset() {
    const questionID = this.props.questionID
    const datasets = ['fillInBlank', 'sentenceFragments', 'diagnosticQuestions'];
    let theDatasetYouAreLookingFor = this.props.questions.data[questionID];
    let mode = 'questions';
    datasets.forEach((dataset) => {
      if (this.props[dataset].data && this.props[dataset].data[questionID]) {
        theDatasetYouAreLookingFor = this.props[dataset].data[questionID];
        mode = dataset;
      }
    });
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  },

  renderSuggestedIncorrectSequences() {
    if (this.props.suggestedSequences && this.props.suggestedSequences.length > 0) {
      const suggestedSequences = []
      const coveredSequences = []
      this.props.suggestedSequences.forEach((seq, i) => {
        const incorrectSequences = this.state.itemText.split('|||')
        const added = incorrectSequences.includes(`${seq}`)
        const covered = _.any(incorrectSequences, inSeq => inSeq.length > 0 && seq.includes(inSeq));
        let color
        if (added) {
          color = '#c0c0c0'
        } else if (covered) {
          color = '#969696'
        } else {
          color = '#3b3b3b'
        }
        const seqTag = this.renderSequenceTag(seq, color, i)
        covered && !added ? coveredSequences.push(seqTag) : suggestedSequences.push(seqTag)
      })
      const suggestedSequencesDiv = suggestedSequences.length > 0 ? <div>
        <label className="label">Suggested Sequences</label>
        <div>{suggestedSequences}</div>
      </div> : null
      const coveredSequencesDiv = coveredSequences.length > 0 ? <div>
        <label className="label">Covered by Selected Sequences</label>
        <div>{coveredSequences}</div>
      </div> : null
      return <div>
        {suggestedSequencesDiv}
        {coveredSequencesDiv}
      </div>
    }
  },

  renderUsedIncorrectSequences() {
    if (this.props.usedSequences && this.props.usedSequences.length > 0) {
      const usedSequences = this.props.usedSequences.map((seq, i) => this.renderSequenceTag(seq, '#c0c0c0', i))
        return <div>
          <label className="label">Previously Used Sequences</label>
          <div>
            {usedSequences}
          </div>
        </div>
    }
  },

  renderCoveredByUsedIncorrectSequences() {
    if (this.props.coveredSequences && this.props.coveredSequences.length > 0) {
      const coveredSequences = this.props.coveredSequences.map((seq, i) => this.renderSequenceTag(seq, '#969696', i))
        return <div>
          <label className="label">Covered by Previously Used Sequences</label>
          <div>
            {coveredSequences}
          </div>
        </div>
    }
  },

  renderSequenceTag(seq, backgroundColor, i) {
    return <span
        className="tag"
        style={{margin: '5px', backgroundColor: backgroundColor, color: 'white'}}
        key={i}
        onClick={() => this.toggleSuggestedSequence(seq)}>
      {seq}
      </span>
   },

  renderSuggestedIncorrectSequencesSection() {
    if (this.props.suggestedSequences && this.props.suggestedSequences.length > 0) {
      return <div>
        {this.renderSuggestedIncorrectSequences()}
        {this.renderUsedIncorrectSequences()}
        {this.renderCoveredByUsedIncorrectSequences()}
      </div>
    }
  },

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    return (
      <div>
        <div className="box add-incorrect-sequence">
          <h4 className="title">{this.addOrEditItemLabel()}</h4>
          <div className="control">
            <label className="label">{this.props.itemLabel} Text</label>
            {this.renderTextInputFields()}
            {this.renderSuggestedIncorrectSequencesSection()}
            <label className="label" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor text={this.state.itemFeedback || ""} handleTextChange={this.handleFeedbackChange} key={"feedback"}/>
            <label className="label" style={{ marginTop: 10, }}>Concepts</label>
            {this.renderConceptSelectorFields()}
          </div>
          <p className="control">
            <button className={'button is-primary '} onClick={() => this.submit(this.props.item ? this.props.item.id : null)}>Submit</button>
            <button className={'button is-outlined is-info'} style={{ marginLeft: 5, }} onClick={() => window.history.back()}>Cancel</button>
          </p>
        </div>
        <div>
          <label className="label">{this.state.matchedCount} {this.state.matchedCount === 1 ? 'sequence' : 'sequences'} affected</label>
          <ResponseComponent
            selectedIncorrectSequences={this.state.itemText.split('|||')}
            question={dataset}
            mode={mode}
            states={this.props.states}
            questionID={this.props.questionID}
          />
        </div>
      </div>
    );
  },

});
