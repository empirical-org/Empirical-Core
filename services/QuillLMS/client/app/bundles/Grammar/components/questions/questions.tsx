import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/questions';
import _ from 'underscore';
import { Link } from 'react-router';
import {
  Modal,
  ArchivedButton
} from 'quill-component-library/dist/componentLibrary';
import QuestionListByConcept from './questionListByConcept'
import checkAnswer from '../../libs/checkAnswer';
import { push } from 'react-router-redux';
import respWithStatus from '../../libs/responseTools.ts';
import { submitResponseEdit, deleteResponse } from '../../actions/responses';

function sleep(milliseconds) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i+=1) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

class Questions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showOnlyArchived: false,
      questions: props.questions.hasreceiveddata ? props.questions.data : {}
    }

    this.createNew = this.createNew.bind(this)
    this.submitNewQuestion = this.submitNewQuestion.bind(this)
    this.updateRematchedResponse = this.updateRematchedResponse.bind(this)
    this.mapConceptsToList = this.mapConceptsToList.bind(this)
    this.responsesWithStatusForQuestion = this.responsesWithStatusForQuestion.bind(this)
    this.rematchAllResponses = this.rematchAllResponses.bind(this)
    this.rematchResponse = this.rematchResponse.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.toggleShowArchived = this.toggleShowArchived.bind(this)
    this.renderSearchBox = this.renderSearchBox.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { questions } = nextProps
    if (questions.hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.questions.data, questions.data)) {
        this.setState({ questions: questions.data })
      }
    }
  }

  createNew() {
    this.props.dispatch(actions.toggleNewQuestionModal());
  }

  submitNewQuestion() {
    const newQuestion = { name: this.refs.newQuestionName.value, };
    this.props.dispatch(actions.submitNewQuestion(newQuestion));
    this.refs.newQuestionName.value = '';
    // this.props.dispatch(actions.toggleNewQuestionModal())
  }

  updateRematchedResponse(rid, vals) {
    this.props.dispatch(submitResponseEdit(rid, vals));
  }

  getErrorsForAttempt(attempt) {
    return attempt.feedback;
  }

  generateFeedbackString(attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    return errors;
  }
  // functions for rematching all Responses
  mapConceptsToList() {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions.data);
    const conceptsWithQuestions = concepts.map(concept => _.where(questions, { conceptID: concept.uid, }));
    return _.flatten(conceptsWithQuestions);
  }

  responsesWithStatusForQuestion(questionUID) {
    const responses = this.props.responses.data[questionUID];
    return hashToCollection(respWithStatus(responses));
  }

  rematchAllResponses(question) {
    const responsesWithStat = this.responsesWithStatusForQuestion(question.key);
    const weak = _.filter(responsesWithStat, resp => resp.statusCode > 1);
    weak.forEach((resp, index) => {
      const percentage = index / weak.length * 100;
      this.rematchResponse(question, resp, responsesWithStat);
    });
  }

  rematchResponse(question, response, responses) {
    if (!response.questionUID || !response.text) {
      return;
    }
    const newMatchedResponse = checkAnswer(question, response, responses);
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
          submitResponseEdit(response.key, newValues, response.questionUID)
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
  }

  renderModal() {
    const stateSpecificClass = this.props.questions.submittingnew ? 'is-loading' : '';
    if (this.props.questions.newQuestionModalOpen) {
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
  }

  handleSearchChange(e) {
    const action = push(`/admin/questions/${e.value}`);
    this.props.dispatch(action);
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }

  renderSearchBox() {
    return null
    // const options = hashToCollection(this.props.questions.data);
    // if (options.length > 0) {
    //   const formatted = options.map((opt) => {
    //     let name;
    //     if (opt.prompt) {
    //       name = opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
    //     } else {
    //       name = 'No name';
    //     }
    //     return { name, value: opt.key || 'key', };
    //   });
    //   const searchBox = (<QuestionSelector options={formatted} placeholder="Search for a question" onChange={this.handleSearchChange} />);
    //   return searchBox;
    // }
  }

  render() {
    const { questions, concepts, } = this.props;
    if (questions.hasreceiveddata && concepts.hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            { this.renderModal() }
            { this.renderSearchBox() }
            <br />
            <ArchivedButton lessons={false} showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
            <br />
            <br />
            <QuestionListByConcept
              basePath={'questions'}
              concepts={concepts}
              questions={this.state.questions}
              showOnlyArchived={this.state.showOnlyArchived}
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
    routing: state.routing
  };
}

export default connect(select)(Questions);
