import { ContentState, EditorState } from 'draft-js';
import { Response } from 'quill-marking-logic';
import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';


import getBoilerplateFeedback from './boilerplateFeedback';
import ConceptResultList from './conceptResultList';

import { requestPost } from '../../../../modules/request/index';
import { TextEditor } from '../../../Shared/index';
import { clearDisplayMessageAndError } from '../../actions/display';
import * as massEdit from '../../actions/massEdit';
import {
  massEditDeleteResponses, submitMassEditConceptResults, submitMassEditFeedback
} from '../../actions/responses';
import { Match } from '../../interfaces/match';
import { DisplayReducerState } from '../../reducers/displayReducer';
import { MassEditReducerState } from '../../reducers/massEditReducer';

interface MassEditState {
  responses: {[key: string]: Response},
  selectedMassEditBoilerplateCategory: string,
  newMassEditConceptResultConceptUID: string,
  newMassEditConceptResultCorrect: boolean,
  massEditSummaryListDisplay: string,
  massEditSummaryListButtonText: string,
  conceptResults?: {[key: string]: boolean}
  massEditFeedback?: string;
  selectedMassEditBoilerplate?: string;
}

interface MassEditProps {
  display: DisplayReducerState;
  massEdit: MassEditReducerState;
  match: Match;
  dispatch: Function;
}

class MassEditContainer extends React.Component<MassEditProps, MassEditState> {
  state = {
    responses: {},
    selectedMassEditBoilerplateCategory: '',
    newMassEditConceptResultConceptUID: '',
    newMassEditConceptResultCorrect: false,
    massEditSummaryListDisplay: 'none',
    massEditSummaryListButtonText: 'Expand List',
  };

  UNSAFE_componentWillMount() {
    this.getResponses();
  }

  componentDidUpdate(prevProps: MassEditProps, prevState: MassEditState) {
    if (this.props.display.message !== prevProps.display.message || this.props.display.error !== prevProps.display.error) {
      this.displayMessage();
    }
  }

  getResponses = () => {
    requestPost(
      `${import.meta.env.QUILL_CMS}/responses/mass_edit/show_many`,
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
    this.props.dispatch(massEdit.clearResponsesFromMassEditArray());
    this.goBackToResponses();
  }

  removeResponseFromMassEditArray(responseKey: string) {
    this.props.dispatch(massEdit.removeResponseFromMassEditArray(responseKey));
  }

  goBackToResponses() {
    const newLocation = window.location.hash.replace('mass-edit', 'responses');
    window.location.href = newLocation;
  }

  updateResponseFeedbackInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    const feedback = this.state.massEditFeedback;
    const optimal = this.refs.massEditOptimal.checked || false;
    const parentId = null;
    const author = null;
    const payload = {
      feedback,
      optimal,
      parent_id: parentId,
      author,
    };
    const qid = this.props.match.params.questionID;
    this.props.dispatch(submitMassEditFeedback(selectedResponses, payload, qid));
  }

  displayMessage() {
    if (this.props.display.message || this.props.display.error) {
      const alert = this.props.display.message || this.props.display.error;
      window.alert(`${alert}`);
      this.props.dispatch(clearDisplayMessageAndError());
    }
  }

  updateConceptResults = (conceptResults: {[key: string]: boolean}) => {
    this.setState({ conceptResults, });
  }

  updateResponseConceptResultInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    const qid = this.props.match.params.questionID;
    this.props.dispatch(submitMassEditConceptResults(selectedResponses, this.state.conceptResults, qid));
  }

  deleteAllResponsesInMassEditArray() {
    const selectedResponses = this.props.massEdit.selectedResponses;
    const qid = this.props.match.params.questionID;

    if (window.confirm(`⚠️ Delete ${selectedResponses.length} responses?! 😱`)) {
      this.props.dispatch(massEditDeleteResponses(selectedResponses, qid));
      this.clearResponsesFromMassEditArray();
    }
  }

  handleMassEditFeedbackTextChange = (value: string) => {
    this.setState({ massEditFeedback: value, });
  }

  toggleMassEditSummaryList = () => {
    let display = 'none';
    let text = 'Expand List';
    if (this.state.massEditSummaryListButtonText === 'Expand List') {
      display = 'block';
      text = 'Collapse List';
    }
    this.setState({
      massEditSummaryListDisplay: display,
      massEditSummaryListButtonText: text,
    });
  }

  renderMassEditSummaryListResponse(response: string) {
    return (
      <p><input checked defaultChecked onClick={() => this.removeResponseFromMassEditArray(response)} style={{ marginRight: '0.5em', }} type="checkbox" />{this.state.responses[response].text}</p>
    );
  }

  renderMassEditSummaryList() {
    const summaryResponses = this.props.massEdit.selectedResponses.map(response => this.renderMassEditSummaryListResponse(response));
    return (<div className="content">{summaryResponses}</div>);
  }

  boilerplateCategoriesToOptions() {
    return getBoilerplateFeedback().map(category => (
      <option className="boilerplate-feedback-dropdown-option" key={category.key}>{category.description}</option>
    ));
  }

  boilerplateSpecificFeedbackToOptions(selectedCategory: any) {
    return selectedCategory.children.map((childFeedback: {[key: string]: string}) => (
      <option className="boilerplate-feedback-dropdown-option" key={childFeedback.key}>{childFeedback.description}</option>
    ));
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
              <h3>FEEDBACK</h3>
              <TextEditor
                boilerplate={this.state.selectedMassEditBoilerplate || ''}
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
    let content;
    if (Object.keys(this.state.responses).length > 0) {
      content = <div>{this.renderMassEditForm()}</div>;
    } else {
      content = <span>There are no selected responses</span>;
    }
    return content;
  }
}

function select(state: any) {
  return {
    massEdit: state.massEdit,
    display: state.display,
  };
}

export default connect(select)(MassEditContainer);
