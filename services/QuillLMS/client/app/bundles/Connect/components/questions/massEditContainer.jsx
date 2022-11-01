import React from 'react';
import { connect } from 'react-redux';

import massEdit from '../../actions/massEdit';
import { TextEditor } from '../../../Shared/index';
import { EditorState, ContentState } from 'draft-js'
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import ConceptResultList from './conceptResultList.jsx';
import _ from 'underscore';
import {
  deleteResponse,
  incrementResponseCount,
  submitResponseEdit,
  removeLinkToParentID,
  setUpdatedResponse,
  submitMassEditFeedback,
  submitMassEditConceptResults,
  massEditDeleteResponses
} from '../../actions/responses';
import { requestPost, } from '../../../../modules/request/index'
import { clearDisplayMessageAndError } from '../../actions/display';

class MassEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      responses: {},
      selectedMassEditBoilerplateCategory: '',
      newMassEditConceptResultConceptUID: '',
      newMassEditConceptResultCorrect: false,
      massEditSummaryListDisplay: 'none',
      massEditSummaryListButtonText: 'Expand List',
    };
  }

  componentDidMount() {
    this.getResponses();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.display.message !== prevProps.display.message || this.props.display.error !== prevProps.display.error) {
      this.displayMessage();
    }
  }

  getResponses = () => {
    requestPost(
      `${process.env.QUILL_CMS}/responses/mass_edit/show_many`,
      { responses: this.props.massEdit.selectedResponses, },
      (data) => {
        const parsedResponses = _.indexBy(data.responses, 'id');
        this.setState({
          responses: parsedResponses,
        });
      }
    )
  }

  boilerplateCategoriesToOptions = () => {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option" key={category.key}>{category.description}</option>
    ));
  }

  boilerplateSpecificFeedbackToOptions = (selectedCategory) => {
    return selectedCategory.children.map(childFeedback => (
      <option className="boilerplate-feedback-dropdown-option" key={childFeedback.key}>{childFeedback.description}</option>
    ));
  }

  chooseMassEditBoilerplateCategory = (e) => {
    this.setState({ selectedMassEditBoilerplateCategory: e.target.value, });
  }

  chooseMassEditSpecificBoilerplateFeedback = (e) => {
    if (e.target.value === 'Select specific boilerplate feedback') {
      this.setState({ selectedMassEditBoilerplate: '', });
    } else {
      this.setState({ selectedMassEditBoilerplate: e.target.value, });
    }
  }

  clearResponsesFromMassEditArray = () => {
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
    this.goBackToResponses();
  }

  deleteAllResponsesInMassEditArray = () => {
    const { match } = this.props
    const selectedResponses = this.props.massEdit.selectedResponses;
    const qid = match.params.questionID;

    if (window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
      this.props.dispatch(massEditDeleteResponses(selectedResponses, qid));
      this.clearResponsesFromMassEditArray();
    }
  }

  displayMessage = () => {
    if (this.props.display.message || this.props.display.error) {
      const alert = this.props.display.message || this.props.display.error;
      window.alert(`${alert}`);
      this.props.dispatch(clearDisplayMessageAndError());
    }
  }

  goBackToResponses = () => {
    const newLocation = window.location.hash.replace('mass-edit', 'responses');
    window.location = newLocation;
  }

  handleMassEditFeedbackTextChange = value => {
    this.setState({ massEditFeedback: value, });
  };

  incrementAllResponsesInMassEditArray = () => {
    const selectedResponses = this.props.massEdit.selectedResponses;
    selectedResponses.forEach(response => this.props.dispatch(incrementResponseCount(this.props.questionID, response)));
  }

  removeResponseFromMassEditArray = (responseKey) => {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  toggleMassEditSummaryList = () => {
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

  updateConceptResults = conceptResults => {
    this.setState({ conceptResults, });
  };

  updateResponseConceptResultInMassEditArray = () => {
    const { match } = this.props
    const selectedResponses = this.props.massEdit.selectedResponses;
    const qid = match.params.questionID;
    this.props.dispatch(submitMassEditConceptResults(selectedResponses, this.state.conceptResults, qid));
  }

  updateResponseFeedbackInMassEditArray = () => {
    const { match } = this.props
    const selectedResponses = this.props.massEdit.selectedResponses;
    const feedback = this.state.massEditFeedback;
    const optimal = this.refs.massEditOptimal.checked || false;
    const parent_id = null;
    const author = null;
    const payload = {
      feedback,
      optimal,
      parent_id,
      author,
    };
    const qid = match.params.questionID;
    this.props.dispatch(submitMassEditFeedback(selectedResponses, payload, qid));
  }

  renderMassEditForm = () => {
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
              <h3>FEEDBACK</h3>
              <TextEditor
                boilerplate={this.state.selectedMassEditBoilerplate}
                ContentState={ContentState}
                EditorState={EditorState}
                handleTextChange={this.handleMassEditFeedbackTextChange}
                text={this.state.massEditFeedback || ''}
              />
            </div>
            <div className="content">
              <label className="checkbox">
                <h3><input defaultChecked={false} ref="massEditOptimal" type="checkbox" /> OPTIMAL</h3>
              </label>
            </div>
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" onClick={() => this.updateResponseFeedbackInMassEditArray()}>Update Feedback</a>
          </footer>
        </div>
        <div className="card is-fullwidth has-bottom-margin has-top-margin">
          <header className="card-content expanded">
            <h1 className="title is-3" style={{ display: 'inline-block', }}>Add Concept Results for <strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses</h1>
          </header>
          <div className="card-content">
            <div className="content">
              <h3>CONCEPT RESULTS <span style={{ fontSize: '0.7em', marginLeft: '0.75em', }}>All other concept results associated with selected responses will be overwritten</span></h3>
              <ConceptResultList updateConceptResults={this.updateConceptResults} />
            </div>
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" onClick={() => this.updateResponseConceptResultInMassEditArray()}>Add Concept Result</a>
          </footer>
        </div>
      </div>
    );
  }

  renderMassEditSummaryList = () => {
    const summaryResponses = this.props.massEdit.selectedResponses.map(response => this.renderMassEditSummaryListResponse(response));
    return (<div className="content">{summaryResponses}</div>);
  }

  renderMassEditSummaryListResponse = (response) => {
    return (
      <p><input checked defaultChecked onClick={() => this.removeResponseFromMassEditArray(response)} style={{ marginRight: '0.5em', }} type="checkbox" />{this.state.responses[response].text}</p>
    );
  }

  render() {
    let content;
    if (Object.keys(this.state.responses).length > 0) {
      content = <div>{this.renderMassEditForm()}</div>;
    } else {
      content = <span>There are no selected responses</span>;
    }
    return content;
  }
}

function select(state) {
  return {
    massEdit: state.massEdit,
    display: state.display,
  };
}

export default connect(select)(MassEditContainer);
