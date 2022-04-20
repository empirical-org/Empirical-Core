import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/questions';
import _ from 'underscore';
import { QuestionListByConcept } from '../shared/questionListByConcept'
import Question from '../../libs/question';
import SelectSearch from 'react-select-search';
import { fuzzySearch } from 'react-select-search';
import { push } from 'react-router-redux';
import respWithStatus from '../../libs/responseTools.js';
import { submitResponseEdit, setUpdatedResponse, deleteResponse } from '../../actions/responses';
import {
  Modal,
  ArchivedButton,
  hashToCollection
} from '../../../Shared/index'

function sleep(milliseconds) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

class Questions extends React.Component {
  constructor(props) {
    super(props)

    const { questions } = props

    this.state = {
      diagnosticQuestions: questions.data ? questions.data : null,
      showOnlyArchived: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { questions, lessons } = nextProps
    const { diagnosticQuestions } = this.state;
    if (questions.hasreceiveddata && lessons.hasreceiveddata) {
      if (Object.keys(diagnosticQuestions).length === 0 || !_.isEqual(this.props.questions.data, questions.data) || (!_.isEqual(this.props.lessons.data, lessons.data))) {
        this.setState({ diagnosticQuestions: questions.data })
      }
    }
  }

  createNew = () => {
    const { dispatch } = this.props;
    dispatch(actions.toggleNewQuestionModal());
  };

  submitNewQuestion = () => {
    const { dispatch } = this.props;
    const newQuestion = { name: this.refs.newQuestionName.value, };
    dispatch(actions.submitNewQuestion(newQuestion));
    this.refs.newQuestionName.value = '';
  };

  updateRematchedResponse = (rid, vals) => {
    const { dispatch } = this.props;
    dispatch(submitResponseEdit(rid, vals));
  };

  getErrorsForAttempt(attempt) {
    return attempt.feedback;
  }

  generateFeedbackString(attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    return errors;
  }

  getMatchingResponse(quest, response, responses) {
    const fields = {
      questionUID: quest.key,
      responses: _.filter(responses, resp => resp.statusCode < 2),
      focusPoints: quest.focusPoints ? hashToCollection(quest.focusPoints) : [],
    };
    const question = new Question(fields);
    return question.checkMatch(response.text);
  }

  // functions for rematching all Responses
  mapConceptsToList = () => {
    let { concepts, questions } = this.props;
    concepts = hashToCollection(concepts.data['0']);
    questions = hashToCollection(questions.data);
    const conceptsWithQuestions = concepts.map(concept => _.where(questions, { conceptID: concept.uid, }));
    return _.flatten(conceptsWithQuestions);
  };

  responsesWithStatusForQuestion = questionUID => {
    let { responses } = this.props;
    const { data } = responses;
    responses = data[questionUID];
    return hashToCollection(respWithStatus(responses));
  };

  rematchAllResponses = (question) => {
    const responsesWithStat = this.responsesWithStatusForQuestion(question.key);
    const weak = _.filter(responsesWithStat, resp => resp.statusCode > 1);
    weak.forEach((resp, index) => {
      const percentage = index / weak.length * 100;
      this.rematchResponse(question, resp, responsesWithStat);
    });
  };

  rematchResponse = (question, response, responses) => {
    if (!response.questionUID || !response.text) {
      return;
    }
    const newMatchedResponse = this.getMatchingResponse(question, response, responses);
    const changed =
    (newMatchedResponse.response.parentID !== response.parentID) ||
    (newMatchedResponse.response.author !== response.author) ||
    (newMatchedResponse.response.feedback !== response.feedback) ||
    (newMatchedResponse.response.conceptResults !== response.conceptResults);
    const unmatched = (newMatchedResponse.found === false);
    if (changed) {
      if (unmatched) {
        const newValues = {
          weak: false,
          text: response.text,
          count: response.count || 1,
          questionUID: response.questionUID,
          gradeIndex: `unmatched${response.questionUID}`,
        };
        sleep(150);
        this.props.dispatch(
          setUpdatedResponse(response.key, newValues)
        );
      } else if (newMatchedResponse.response.parentID === undefined) {
        this.props.dispatch(
          deleteResponse(question.key, response.key)
        );
      } else {
        const newValues = {
          weak: false,
          parentID: newMatchedResponse.response.parentID,
          author: newMatchedResponse.response.author,
          feedback: newMatchedResponse.response.feedback,
          gradeIndex: `nonhuman${response.questionUID}`,
        };
        if (newMatchedResponse.response.conceptResults) {
          newValues.conceptResults = newMatchedResponse.response.conceptResults;
        }
        sleep(150);
        this.updateRematchedResponse(response.key, newValues);
      }
    }
  };

  renderModal = () => {
    const { questions } = this.props;
    const { newQuestionModalOpen, submittingnew } = questions;
    const stateSpecificClass = submittingnew ? 'is-loading' : '';
    if (newQuestionModalOpen) {
      return (
        <Modal close={this.createNew}>
          <div className="box">
            <h4 className="title">Add New Question</h4>
            <p className="control">
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="Text input"
                ref="newQuestionName"
                type="text"
              />
            </p>
            <p className="control">
              <span className="select">
                <select>
                  <option>Choose a concept</option>
                  <option>And</option>
                  <option>Or</option>
                </select>
              </span>
            </p>
            <p className="control">
              <button className={`button is-primary ${stateSpecificClass}`} onClick={this.submitNewQuestion}>Submit</button>
            </p>
          </div>
        </Modal>
      );
    }
  };

  handleSearchChange = value => {
    const { dispatch } = this.props;
    const action = push(`/admin/questions/${value}/responses`);
    dispatch(action);
  };

  toggleShowArchived = () => {
    this.setState(prevState => ({ showOnlyArchived: !prevState.showOnlyArchived }))
  };

  renderSearchBox = () => {
    const { questions } = this.props;
    const { data } = questions;
    const options = hashToCollection(data);
    if (options.length > 0) {
      const formatted = options.map((opt) => {
        let name;
        if (opt.prompt) {
          name = opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
        } else {
          name = 'No name';
        }
        return { name, value: opt.key || 'key', };
      });
      const searchBox = (
        <SelectSearch
          filterOptions={fuzzySearch}
          onChange={this.handleSearchChange}
          options={formatted}
          placeholder="Search for a question"
          search={true}
        />
      );
      return searchBox;
    }
  };

  render() {
    const { questions, concepts, } = this.props;
    const { diagnosticQuestions, showOnlyArchived } = this.state;
    if (questions.hasreceiveddata && concepts.hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            { this.renderModal() }
            <div>
              { this.renderSearchBox() }
            </div>
            <br />
            <ArchivedButton lessons={false} showOnlyArchived={showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
            <br />
            <br />
            <QuestionListByConcept
              basePath="questions"
              concepts={concepts}
              questions={diagnosticQuestions}
              showOnlyArchived={showOnlyArchived}
            />

          </div>
        </section>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    // responses: state.responses,
    routing: state.routing,
    lessons: state.lessons
  };
}

export default connect(select)(Questions);
