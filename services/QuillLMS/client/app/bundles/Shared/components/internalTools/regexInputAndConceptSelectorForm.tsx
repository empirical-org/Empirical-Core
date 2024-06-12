import React from 'react';
import _ from 'underscore';

import { TextEditor, isValidFocusPointOrIncorrectSequence, ConceptSelectorWithCheckbox, } from '../../../Shared/index';
import { requestPost, } from '../../../../modules/request/index';

export const FOCUS_POINT = 'FOCUS_POINT'
export const INCORRECT_SEQUENCE = 'INCORRECT_SEQUENCE'

export class RegexInputAndConceptSelectorForm extends React.Component {
  constructor(props) {
    super(props)

    const { item, } = props;

    this.state = {
      name: item?.name || '',
      itemText: item ? `${item.text}|||` : '',
      itemFeedback: item?.feedback || '',
      itemConcepts: item?.conceptResults || {},
      caseInsensitive: item ? (item.caseInsensitive ? item.caseInsensitive : false) : true,
      matchedCount: 0
    }
  }

  getNewAffectedCount = () => {
    const { questionID, focusPointOrIncorrectSequence, usedSequences, } = this.props
    const { itemText, } = this.state

    const newSeqs = itemText.split(/\|{3}(?!\|)/)

    let path = 'focus_point_affected_count'
    const data = { selected_sequences: newSeqs, }

    if (focusPointOrIncorrectSequence === INCORRECT_SEQUENCE) {
      path = 'incorrect_sequence_affected_count'
      data.used_sequences = usedSequences
    }
    requestPost(
      `${process.env.QUILL_CMS}/responses/${questionID}/${path}`,
      {data},
      (body) => {
        this.setState({matchedCount: body.matchedCount})
      }
    )
  };

  addOrEditItemLabel = () => {
    const { item, itemLabel, } = this.props

    return item ? `Edit ${itemLabel}` : `Add New ${itemLabel}`;
  }

  deleteConceptResult = (key) => {
    const { itemConcepts, } = this.state

    const newConceptResults = Object.assign({}, itemConcepts)
    delete newConceptResults[key]
    this.setState({itemConcepts: newConceptResults})
  }

  handleNameChange = e => {
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
  };

  handleConceptChange = e => {
    const { itemConcepts, } = this.state

    const concepts = itemConcepts;
    if (!concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = { correct: false, name: e.label, conceptUID: e.value, };
      this.setState({
        itemConcepts: concepts,
      });
    }
  };

  handleFeedbackChange = e => {
    this.setState({itemFeedback: e})
  };

  handleToggleQuestionCaseInsensitive = () => {
    this.setState(prevState => ({caseInsensitive: !prevState.caseInsensitive}));
  }

  submit = (record) => {
    const { name, itemText, itemFeedback, itemConcepts, caseInsensitive, } = this.state
    const { onSubmit, focusPointOrIncorrectSequence, } = this.props

    const regexes = itemText.split(/\|{3}(?!\|)/).filter(val => val !== '')
    if (regexes.every(r => isValidFocusPointOrIncorrectSequence(r))) {
      const regexString = regexes.join('|||')
      const data = {
        name: name,
        text: regexString,
        feedback: itemFeedback,
        conceptResults: itemConcepts,
      };

      if (focusPointOrIncorrectSequence === INCORRECT_SEQUENCE) {
        data.caseInsensitive = caseInsensitive || false
      }
      onSubmit(data, record);
    } else {
      window.alert('Your focus point or incorrect sequence is invalid. Check your regex syntax and try again!')
    }
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
  }

  renderTextInputFields = () => {
    const { itemText, } = this.state

    return itemText.split(/\|{3}(?!\|)/).map(text => (
      <input className="input focus-point-text" onBlur={this.getNewAffectedCount} onChange={this.handleChange.bind(null, 'itemText')} style={{ marginBottom: 5, }} type="text" value={text || ''} />
    ));
  }

  renderConceptSelectorFields = () => {
    const { itemConcepts, } = this.state
    const components = _.mapObject(Object.assign({}, itemConcepts, { null: { correct: false, text: 'This is a placeholder', }, }), (val, key) => (
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

  renderExplanatoryNote = () => {
    return (
      <div style={{ marginBottom: '10px' }}>
        <p>Focus points can contain regular expressions. See <a href="https://www.regextester.com/">this page</a> to test regular expressions, and access the cheat sheet on the right. <b>Note:</b> any periods need to be prefaced with a backslash ("\") in order to be evaluated correctly. Example: "walked\."</p>
        <br />
        <p>In order to indicate that two or more words or phrases must appear in the response together, you can separate them using "&&". Example: "running&&dancing&&swimming", "run&&dance&&swim".</p>
      </div>
    )
  }

  renderCaseInsensitiveToggle = () => {
    const { focusPointOrIncorrectSequence, } = this.props
    const { caseInsensitive, } = this.state

    if (focusPointOrIncorrectSequence === FOCUS_POINT) { return }

    return (
      <p className="control checkbox-wrapper">
        <input checked={caseInsensitive} className="checkbox" id="case-insensitive" onClick={this.handleToggleQuestionCaseInsensitive} type="checkbox" />
        <label className="label checkbox-label" htmlFor="case-insensitive">Case Insensitive?</label>
      </p>
    )
  }

  render() {
    const { name, itemFeedback, matchedCount, itemText, } = this.state
    const { itemLabel, questionID, states, item, ResponseComponent, focusPointOrIncorrectSequence, } = this.props

    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;

    const responseComponentProps = {
      mode,
      questionID,
      states,
      question: dataset,
    }

    if (focusPointOrIncorrectSequence === FOCUS_POINT) {
      responseComponentProps.selectedFocusPoints = itemText.split(/\|{3}(?!\|)/)
    } else {
      responseComponentProps.selectedIncorrectSequences = itemText.split(/\|{3}(?!\|)/)
    }

    return (
      <div>
        <div className="box add-incorrect-sequence">
          <h4 className="title">{this.addOrEditItemLabel()}</h4>
          {this.renderExplanatoryNote()}
          <div className="control">
            <label className="label">Name</label>
            <input className="input" onChange={this.handleNameChange} type="text" value={name || ''} />
            <label className="label">{itemLabel} Text</label>
            {this.renderTextInputFields()}
            <label className="label" style={{ marginTop: 10, }}>Feedback</label>
            <TextEditor
              handleTextChange={this.handleFeedbackChange}
              key="feedback"
              text={itemFeedback || ""}
            />
            <label className="label" style={{ marginTop: 10, }}>Concepts</label>
            {this.renderConceptSelectorFields()}
            {this.renderCaseInsensitiveToggle()}
          </div>
          <p className="control">
            <button className="button is-primary " onClick={() => this.submit(item?.id)}>Submit</button>
            <button className="button is-outlined is-info" onClick={() => window.history.back()} style={{ marginLeft: 5, }}>Cancel</button>
          </p>
        </div>
        <div>
          <label className="label">{matchedCount} {matchedCount === 1 ? 'sequence' : 'sequences'} affected</label>
          <ResponseComponent {...responseComponentProps} />
        </div>
      </div>
    );
  }
};
