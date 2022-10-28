import React from 'react';
import { connect } from 'react-redux';
import massEdit from '../../actions/massEdit';
import { TextEditor } from '../../../Shared/index';
import { EditorState, ContentState } from 'draft-js'
import getBoilerplateFeedback from './boilerplateFeedback.jsx';
import ConceptResultList from './conceptResultList.jsx';
import _ from 'underscore';
import {
  incrementResponseCount,
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

  UNSAFE_componentWillMount() {
    this.getResponses();
  }

  componentDidUpdate(prevProps, prevState) {
    const { display } = this.props;
    const { error, message } = display;
    if (message !== prevProps.display.message || error !== prevProps.display.error) {
      this.displayMessage();
    }
  }

  getResponses() {
    requestPost(
      `${process.env.QUILL_CMS}/responses/mass_edit/show_many`,
      { responses: this.props.massEdit.selectedResponses, },
      (body) => {
        const parsedResponses = _.indexBy(body.responses, 'id');
        this.setState({
          responses: parsedResponses,
        });
      }
    )
  }

  clearResponsesFromMassEditArray() {
    const { dispatch } = this.props;
    dispatch(massEdit.clearResponsesFromMassEditArray());
    this.goBackToResponses();
  }

  removeResponseFromMassEditArray(responseKey) {
    const { dispatch } = this.props;
    dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  incrementAllResponsesInMassEditArray() {
    const { dispatch, massEdit, questionID } = this.props;
    const { selectedResponses } = massEdit;
    selectedResponses.forEach(response => dispatch(incrementResponseCount(questionID, response)));
  }

  goBackToResponses() {
    const newLocation = window.location.hash.replace('mass-edit', 'responses');
    window.location = newLocation;
  }

  updateResponseFeedbackInMassEditArray() {
    const { dispatch, massEdit, match } = this.props;
    const { selectedResponses } = massEdit;
    const { questionID } = match.params;
    const { massEditFeedback } = this.state;
    const { massEditOptimal } = this.refs;
    const optimal = massEditOptimal.checked || false;
    const parent_id = null;
    const author = null;
    const payload = {
      feedback: massEditFeedback,
      optimal,
      parent_id,
      author,
    };
    dispatch(submitMassEditFeedback(selectedResponses, payload, questionID));
  }

  displayMessage() {
    const { dispatch, display } = this.props;
    const { error, message } = display;
    if (message || error) {
      const alert = message || error;
      window.alert(`${alert}`);
      dispatch(clearDisplayMessageAndError());
    }
  }

  updateConceptResults = conceptResults => {
    this.setState({ conceptResults, });
  };

  updateResponseConceptResultInMassEditArray() {
    const { dispatch, massEdit, match } = this.props;
    const { selectedResponses } = massEdit;
    const { questionID } = match.params;
    const { conceptResults } = this.state;
    dispatch(submitMassEditConceptResults(selectedResponses, conceptResults, questionID));
  }

  deleteAllResponsesInMassEditArray() {
    const { dispatch, massEdit, match, } = this.props;
    const { selectedResponses } = massEdit;
    const { questionID } = match.params;

    if (window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
      dispatch(massEditDeleteResponses(selectedResponses, questionID));
      this.clearResponsesFromMassEditArray();
    }
  }

  handleMassEditFeedbackTextChange = value => {
    this.setState({ massEditFeedback: value, });
  };

  toggleMassEditSummaryList() {
    const { massEditSummaryListButtonText } = this.state;
    let display = 'none';
    let text = 'Expand List';
    if (massEditSummaryListButtonText == 'Expand List') {
      display = 'block';
      text = 'Collapse List';
    }
    this.setState({
      massEditSummaryListDisplay: display,
      massEditSummaryListButtonText: text,
    });
  }

  renderMassEditSummaryListResponse(response) {
    const { responses } = this.state;
    return (
      <p><input checked defaultChecked onClick={() => this.removeResponseFromMassEditArray(response)} style={{ marginRight: '0.5em', }} type="checkbox" />{responses[response].text}</p>
    );
  }

  renderMassEditSummaryList() {
    const { massEdit } = this.props;
    const { selectedResponses } = massEdit;
    const summaryResponses = selectedResponses.map(response => this.renderMassEditSummaryListResponse(response));
    return (<div className="content">{summaryResponses}</div>);
  }

  renderMassEditForm() {
    const { massEdit } = this.props;
    const { selectedResponses } = massEdit;
    const { massEditFeedback, massEditSummaryListButtonText, massEditSummaryListDisplay, selectedMassEditBoilerplate, selectedMassEditBoilerplateCategory } = this.state;
    return (
      <div>
        <div className="card is-fullwidth has-bottom-margin has-top-margin">
          <header className="card-content expanded">
            <div className="content">
              <h1 className="title is-3" style={{ marginBottom: '0', }}><strong style={{ fontWeight: '700', }}>{selectedResponses.length}</strong> Responses Selected for Mass Editing:</h1>
            </div>
          </header>
          <div className="card-content" style={{ display: massEditSummaryListDisplay, }}>
            {this.renderMassEditSummaryList()}
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" onClick={() => this.toggleMassEditSummaryList()}>{massEditSummaryListButtonText}</a>
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
                boilerplate={selectedMassEditBoilerplate}
                ContentState={ContentState}
                EditorState={EditorState}
                handleTextChange={this.handleMassEditFeedbackTextChange}
                text={massEditFeedback || ''}
              />
            </div>
            <div className="content">
              <label className="checkbox">
                <h3><input defaultChecked={false} ref="massEditOptimal" type="checkbox" /> OPTIMAL</h3>
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

  render() {
    const { responses } = this.state;
    let content;
    if (Object.keys(responses).length > 0) {
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
