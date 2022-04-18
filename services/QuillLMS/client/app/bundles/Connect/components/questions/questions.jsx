import * as React from 'react';
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
  hashToCollection,
  Modal,
  ArchivedButton
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
      showOnlyArchived: false,
      questions: questions.data ? questions.data : {}
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { questions } = nextProps
    const { data, hasreceiveddata } = questions
    if (hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.questions.data, data)) {
        this.setState({ questions: data })
      }
    }
  }

  getErrorsForAttempt = (attempt) => {
    return attempt.feedback;
  }

  getMatchingResponse = (quest, response, responses) => {
    const fields = {
      questionUID: quest.key,
      responses: _.filter(responses, resp => resp.statusCode < 2),
      focusPoints: quest.focusPoints ? hashToCollection(quest.focusPoints) : [],
    };
    const question = new Question(fields);
    return question.checkMatch(response.text);
  }

  createNew = () => {
    const { dispatch } = this.props
    dispatch(actions.toggleNewQuestionModal());
  };

  generateFeedbackString = (attempt) => {
    const errors = this.getErrorsForAttempt(attempt);
    return errors;
  }

  handleSearchChange = value => {
    const { dispatch } = this.props
    const action = push(`/admin/questions/${value}`);
    dispatch(action);
  };

  // functions for rematching all Responses
  mapConceptsToList = () => {
    const { concepts, questions } = this.props
    const hashedConcepts = hashToCollection(concepts.data['0']);
    const hashedQuestions = hashToCollection(questions.data);
    const conceptsWithQuestions = hashedConcepts.map(concept => _.where(hashedQuestions, { conceptID: concept.uid, }));
    return _.flatten(conceptsWithQuestions);
  };

  rematchAllResponses = question => {
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

  responsesWithStatusForQuestion = questionUID => {
    const responses = this.props.responses.data[questionUID];
    return hashToCollection(respWithStatus(responses));
  };

  submitNewQuestion = () => {
    const { dispatch } = this.props
    const newQuestion = { name: this.refs.newQuestionName.value, };
    dispatch(actions.submitNewQuestion(newQuestion));
    this.refs.newQuestionName.value = '';
  };

  toggleShowArchived = () => {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  };

  updateRematchedResponse = (rid, vals) => {
    const { dispatch } = this.props
    dispatch(submitResponseEdit(rid, vals));
  };

  renderModal = () => {
    const { questions } = this.props
    const { newQuestionModalOpen, submittingnew } = questions
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

  renderSearchBox = () => {
    const { questions } = this.props
    const { data } = questions
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
    const { questions, showOnlyArchived } = this.state
    const { concepts } = this.props;
    const { hasreceiveddata } = concepts
    const questionsLoaded = Object.keys(questions) !== 0

    if (questionsLoaded && hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            { this.renderModal() }
            { this.renderSearchBox() }
            <br />
            <ArchivedButton lessons={false} showOnlyArchived={showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
            <br />
            <br />
            <QuestionListByConcept
              basePath="questions"
              concepts={concepts}
              questions={questions}
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
    routing: state.routing
  };
}

export default connect(select)(Questions);
