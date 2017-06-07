import React from 'react'
import request from 'request';
import { connect } from 'react-redux';
import massEdit from '../../actions/massEdit';
import TextEditor from './textEditor.jsx';
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import ConceptSelector from '../shared/conceptSelector.jsx';
import _ from 'underscore';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  removeLinkToParentID,
  setUpdatedResponse,
  submitMassEditFeedback
} from '../../actions/responses';

class MassEditContainer extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        responses: {},
        selectedMassEditBoilerplateCategory: '',
        newMassEditConceptResultConceptUID: '',
        newMassEditConceptResultCorrect: false,
        massEditSummaryListDisplay: 'none',
        massEditSummaryListButtonText: 'Expand List',
      };

      this.handleMassEditFeedbackTextChange = this.handleMassEditFeedbackTextChange.bind(this)
      this.selectMassEditConceptForResult = this.selectMassEditConceptForResult.bind(this)
      this.updateMassEditConceptResultCorrect = this.updateMassEditConceptResultCorrect.bind(this)
    }

    componentWillUnmount() {
      // this.clearResponsesFromMassEditArray();
    }

    componentWillMount() {
      this.getResponses();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return true
    }

    getResponses() {
      request(
        {
          url: 'http://localhost:3100/responses/mass_edit',
          method: 'POST',
          json: { responses: this.props.massEdit.selectedResponses },
        },
        (err, httpResponse, data) => {
          const parsedResponses = _.indexBy(data.responses, 'uid');
          this.setState({
            responses: parsedResponses,
          });
        }
      );
    }


    chooseMassEditBoilerplateCategory(e) {
      this.setState({ selectedMassEditBoilerplateCategory: e.target.value, });
    }

    chooseMassEditSpecificBoilerplateFeedback(e) {
      if (e.target.value === 'Select specific boilerplate feedback') {
        this.setState({ selectedMassEditBoilerplate: '', });
      } else {
        this.setState({ selectedMassEditBoilerplate: e.target.value, });
      }
    }

    clearResponsesFromMassEditArray() {
      this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
    }

    removeResponseFromMassEditArray(responseKey) {
      this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
    }

    incrementAllResponsesInMassEditArray() {
      const selectedResponses = this.props.massEdit.selectedResponses;
      selectedResponses.forEach(response => this.props.dispatch(incrementResponseCount(this.props.questionID, response)));
    }

    updateAllResponsesInMassEditArray() {
      const selectedResponses = this.props.massEdit.selectedResponses;
      const newResp = {
        weak: false,
        feedback: this.state.massEditFeedback,
        optimal: this.refs.massEditOptimal.checked,
      };
      selectedResponses.forEach((responseKey) => {
        const uniqVals = Object.assign({}, newResp, {
          gradeIndex: `human${responseKey}`,
          conceptResults: this.state.responses[responseKey].concept_results
        });
        this.props.dispatch(submitResponseEdit(responseKey, uniqVals));
        this.props.dispatch(removeLinkToParentID(responseKey));
      });
    }

    updateResponseFeedbackInMassEditArray() {
      const selectedResponses = this.props.massEdit.selectedResponses;
      const feedback = this.state.massEditFeedback;
      const qid = this.props.params.questionID;
      this.props.dispatch(submitMassEditFeedback(selectedResponses, feedback, qid));
    }

    deleteAllResponsesInMassEditArray() {
      const selectedResponses = this.props.massEdit.selectedResponses;
      if (window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
        selectedResponses.forEach(response => this.props.dispatch(deleteResponse(this.props.questionID, response)));
        this.clearResponsesFromMassEditArray();
      }
    }

    addMassEditConceptResults() {
      const selectedResponses = this.props.massEdit.selectedResponses;
      const newMassEditConceptResultConceptUID = this.state.newMassEditConceptResultConceptUID;
      const newResponses = Object.assign({}, this.state.responses)

      selectedResponses.forEach((responseKey) => {
        const currentConceptResultsForResponse = this.state.responses[responseKey].concept_results || {};
        if (Object.keys(currentConceptResultsForResponse).includes(newMassEditConceptResultConceptUID)) {
          const newResponseConceptResults = Object.assign({}, currentConceptResultsForResponse)
          delete newResponseConceptResults[newMassEditConceptResultConceptUID];
          newResponses[responseKey].concept_results = newResponseConceptResults;
        } else {
          const newResponseConceptResults = Object.assign({}, currentConceptResultsForResponse)
          newResponseConceptResults[newMassEditConceptResultConceptUID] = {}
          newResponseConceptResults[newMassEditConceptResultConceptUID][newMassEditConceptResultConceptUID] = this.state.newMassEditConceptResultCorrect
          newResponses[responseKey].concept_results = newResponseConceptResults
        }

      });
      this.setState({responses: newResponses}, () => this.updateAllResponsesInMassEditArray())
    }

    handleMassEditFeedbackTextChange(value) {
      this.setState({ massEditFeedback: value, });
    }

    selectMassEditConceptForResult(e) {
      this.setState({ newMassEditConceptResultConceptUID: e.value, });
    }

    updateMassEditConceptResultCorrect() {
      this.setState({ newMassEditConceptResultCorrect: this.refs.massEditConceptResultsCorrect.checked, });
    }

    toggleMassEditSummaryList() {
      let display = 'none';
      let text = 'Expand List';
      if (this.state.massEditSummaryListButtonText == 'Expand List') {
        display = 'block';
        text = 'Collapse List';
      }
      this.setState({
        massEditSummaryListDisplay: display,
        massEditSummaryListButtonText: text,
      });
    }

    renderMassEditSummaryListResponse(response) {
      return (
        <p><input type="checkbox" defaultChecked checked style={{ marginRight: '0.5em', }} onClick={() => this.removeResponseFromMassEditArray(response)} />{this.state.responses[response].text}</p>
      );
    }

    renderMassEditSummaryList() {
      const summaryResponses = this.props.massEdit.selectedResponses.map(response => this.renderMassEditSummaryListResponse(response));
      return (<div className="content">{summaryResponses}</div>);
    }

    boilerplateCategoriesToOptions() {
      return getBoilerplateFeedback().map(category => (
        <option key={category.key} className="boilerplate-feedback-dropdown-option">{category.description}</option>
        ));
    }

    boilerplateSpecificFeedbackToOptions(selectedCategory) {
      return selectedCategory.children.map(childFeedback => (
        <option key={childFeedback.key} className="boilerplate-feedback-dropdown-option">{childFeedback.description}</option>
        ));
    }

    renderBoilerplateCategoryDropdown(onChangeEvent) {
      const style = { marginRight: '20px', };
      return (
        <span className="select" style={style}>
          <select className="boilerplate-feedback-dropdown" onChange={onChangeEvent}>
            <option className="boilerplate-feedback-dropdown-option">Select boilerplate feedback category</option>
            {this.boilerplateCategoriesToOptions()}
          </select>
        </span>
      );
    }

    renderBoilerplateCategoryOptionsDropdown(onChangeEvent, description) {
      const selectedCategory = _.find(getBoilerplateFeedback(), { description, });
      if (selectedCategory) {
        return (
          <span className="select">
            <select className="boilerplate-feedback-dropdown" onChange={onChangeEvent} ref="boilerplate">
              <option className="boilerplate-feedback-dropdown-option">Select specific boilerplate feedback</option>
              {this.boilerplateSpecificFeedbackToOptions(selectedCategory)}
            </select>
          </span>
        );
      } else {
        return (<span />);
      }
    }

    renderMassEditForm() {
      const selectedResponses = this.props.massEdit.selectedResponses;
        return (
          <div>
            <div className="card is-fullwidth has-bottom-margin has-top-margin">
              <header className="card-content expanded">
                <div className="content">
                  <h1 className="title is-3" style={{ marginBottom: '0', }}><strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses Selected for Mass Editing:</h1>
                </div>
              </header>
              <div className="card-content" style={{ display: this.state.massEditSummaryListDisplay, }}>
                {this.renderMassEditSummaryList()}
              </div>
              <footer className="card-footer">
                <a className="card-footer-item" onClick={() => this.toggleMassEditSummaryList()}>{this.state.massEditSummaryListButtonText}</a>
                <a className="card-footer-item" onClick={() => this.clearResponsesFromMassEditArray()}>Deselect All</a>
                <a className="card-footer-item" onClick={() => this.deleteAllResponsesInMassEditArray()}>Delete All</a>
              </footer>
            </div>
            <div className="card is-fullwidth has-bottom-margin has-top-margin">
              <header className="card-content expanded">
                <h1 className="title is-3" style={{ display: 'inline-block', }}>Modify Feedback for <strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses</h1>
              </header>
              <div className="card-content">
                <div className="content">
                  <h3>FEEDBACK <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ All other feedback associated with selected responses will be overwritten ⚠️️</span></h3>
                  <TextEditor text={this.state.massEditFeedback || ''} handleTextChange={this.handleMassEditFeedbackTextChange} boilerplate={this.state.selectedMassEditBoilerplate} />
                </div>
                <div className="content">
                  <h4>Boilerplate Feedback</h4>
                  <div className="boilerplate-feedback-dropdown-container">
                    {this.renderBoilerplateCategoryDropdown(this.chooseMassEditBoilerplateCategory)}
                    {this.renderBoilerplateCategoryOptionsDropdown(this.chooseMassEditSpecificBoilerplateFeedback, this.state.selectedMassEditBoilerplateCategory)}
                  </div>
                </div>
                <div className="content">
                  <label className="checkbox">
                    <h3><input ref="massEditOptimal" defaultChecked={false} type="checkbox" /> OPTIMAL <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ All selected responses will be marked with this optimality ⚠️️</span></h3>
                  </label>
                </div>
              </div>
              <footer className="card-footer">
                {/* <a className="card-footer-item" onClick={() => this.incrementAllResponsesInMassEditArray()}>Increment</a> */}
                <a className="card-footer-item" onClick={() => this.updateResponseFeedbackInMassEditArray()}>Update Feedback</a>
                {/* <a className="card-footer-item" onClick={() => alert('This has not been implemented yet.')}>Rematch</a>  */}
              </footer>
            </div>
            <div className="card is-fullwidth has-bottom-margin has-top-margin">
              <header className="card-content expanded">
                <h1 className="title is-3" style={{ display: 'inline-block', }}>Add Concept Results for <strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses</h1>
              </header>
              <div className="card-content">
                <div className="content">
                  <h3>ADD CONCEPT RESULTS <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>⚠️️ This concept result will be added to all selected responses ⚠️️</span></h3>
                  <ConceptSelector currentConceptUID={this.state.newMassEditConceptResultConceptUID} handleSelectorChange={this.selectMassEditConceptForResult} />
                  <br />
                  <label className="checkbox">
                    <h3><input ref="massEditConceptResultsCorrect" defaultChecked={false} type="checkbox" onChange={() => this.updateMassEditConceptResultCorrect()} /> CORRECT</h3>
                  </label>
                </div>
              </div>
              <footer className="card-footer">
                <a className="card-footer-item" onClick={() => this.addMassEditConceptResults()}>Add Concept Result</a>
              </footer>
            </div>
          </div>
        );
    }

    render() {
      let content
      if (Object.keys(this.state.responses).length > 0) {
        content = <div>{this.renderMassEditForm()}</div>
      } else {
        content = <span>There are no selected responses</span>
      }
      return content
    }
}


function select(state) {
  return {
    massEdit: state.massEdit,
  };
}

export default connect(select)(MassEditContainer);
