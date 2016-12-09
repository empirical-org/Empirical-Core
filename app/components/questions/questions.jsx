import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/questions';
import _ from 'underscore';
import { Link } from 'react-router';
import Modal from '../modal/modal.jsx';
import { hashToCollection } from '../../libs/hashToCollection';
import Question from '../../libs/question';
import QuestionsList from './questionsList.jsx';
import QuestionSelector from 'react-select-search';
import { push } from 'react-router-redux';
import { loadAllResponseData } from '../../actions/responses';

const Questions = React.createClass({
  getInitialState() {
    return {
      displayNoConceptQuestions: false,
    };
  },

  createNew() {
    this.props.dispatch(actions.toggleNewQuestionModal());
  },

  submitNewQuestion() {
    const newQuestion = { name: this.refs.newQuestionName.value, };
    this.props.dispatch(actions.submitNewQuestion(newQuestion));
    this.refs.newQuestionName.value = '';
    // this.props.dispatch(actions.toggleNewQuestionModal())
  },

  updateRematchedResponse(qid, rid, vals) {
    this.props.dispatch(actions.submitResponseEdit(qid, rid, vals));
  },

  getErrorsForAttempt(attempt) {
    return attempt.feedback;
  },

  generateFeedbackString(attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    return errors;
  },

  getMatchingResponse(quest, response) {
    const fields = {
      responses: _.filter(this.responsesWithStatus(quest), resp => resp.statusCode < 2),
      focusPoints: quest.focusPoints ? hashToCollection(quest.focusPoints) : [],
    };
    const question = new Question(fields);
    return question.checkMatch(response.text);
  },

  // Functions for rematching all Responses
  mapConceptsToList() {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions.data);
    const conceptsWithQuestions = concepts.map(concept => _.where(questions, { conceptID: concept.uid, }));
    return _.flatten(conceptsWithQuestions);
  },

  responsesWithStatus(question) {
    const responses = hashToCollection(question.responses);
    return responses.map((response) => {
      let statusCode;
      if (!response.feedback) {
        statusCode = 4;
      } else if (response.parentID) {
        // var parentResponse = this.getResponse(response.parentID)
        statusCode = 3;
      } else {
        statusCode = (response.optimal ? 0 : 1);
      }
      response.statusCode = statusCode;
      return response;
    });
  },

  rematchAllQuestions() {
    const ignoreList = [
      '-KP-LIzVyeL6a38yW0im',
      '-KPt1wiz5zY1JgNSLbQZ',
      '-KPt6EDsKbaXVrIf9dJY',
      '-KPt2OD4fkKen27eyiry',
      '-KPt2ZzZAIVsrQ-asGEY',
      '-KP-M1Crf2pvqO4QH6zI',
      '-KP-M7WtUdYK6vd6S57X',
      '-KP-MEpdOxjU7OyzL6ss',
      '-KPt2jWGaZbGEaUKj-da',
      '-KPt2vzVYs2QAWkeo7QT',
      '-KPt3I_hR_Xlv5Cr1mvB',
      '-KP-Mv5jsZKhraQH2DOt',
      '-KPt3fnhAJ_vQF_dD4Oj',
      '-KPt3uD8hulWiYGp3Rm7',
      '-KP-Nc414z5N_TKwnvms',
      '-KP-M1Crf2pvqO4QH6zI-esp',
      '-KP-LIzVyeL6a38yW0im-esp',
      '-KP-M7WtUdYK6vd6S57X-esp',
      '-KPt2OD4fkKen27eyiry-esp',
      '-KP-MEpdOxjU7OyzL6ss-esp',
      '-KPt3I_hR_Xlv5Cr1mvB-esp',
      '-KP-Mv5jsZKhraQH2DOt-esp',
      '-KPt3fnhAJ_vQF_dD4Oj-esp',
      '-KPt3uD8hulWiYGp3Rm7-esp'
    ];

    console.log('Rematching All Questions');
    _.each(hashToCollection(this.props.questions.data), (question) => {
      if (ignoreList.indexOf(question.key) === -1) {
        console.log('Rematching Question: ', question.key);
          // this.rematchAllResponses(question);
      } else {
        console.log('Ignoring');
      }
    });
    console.log('Finished Rematching All Questions');
  },

  rematchAllResponses(question) {
    console.log('Rematching All Responses');
    const weak = _.filter(this.responsesWithStatus(question), resp => resp.statusCode > 1);
    weak.forEach((resp) => {
      this.rematchResponse(resp, question);
    });
    console.log('Finished Rematching All Responses');
  },

  rematchResponse(response, question) {
    const newResponse = this.getMatchingResponse(question, response);
    if (!newResponse.found) {
      console.log('No response match');
      const newValues = {
        weak: false,
        text: response.text,
        count: response.count,
      };
      this.props.dispatch(
        actions.setUpdatedResponse(question.key, response.key, newValues)
      );
      return;
    }
    if (newResponse.response.text === response.text) {
      console.log('Rematching duplicate', newResponse);
      this.props.dispatch(actions.deleteResponse(question.key, response.key));
    } else if (newResponse.response.key === response.parentID) {
      console.log('Same response  match', question.key, response.key);
      if (newResponse.author) {
        var newErrorResp = {
          weak: false,
          author: newResponse.author,
          feedback: this.generateFeedbackString(newResponse),
        };
        this.updateRematchedResponse(question.key, response.key, newErrorResp);
      }
    } else {
      console.log('New response  match');
      var newErrorResp = {
        weak: false,
        parentID: newResponse.response.key,
        author: newResponse.author,
        feedback: this.generateFeedbackString(newResponse),
      };
      this.updateRematchedResponse(question.key, response.key, newErrorResp);
    }
    // this.updateReponseResource(response)
    // this.submitResponse(response)
    // this.setState({editing: false})
  },

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
                type="text"
                placeholder="Text input"
                ref="newQuestionName"
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
  },

  handleSearchChange(e) {
    const action = push(`/admin/questions/${e.value}`);
    this.props.dispatch(action);
  },

  toggleNoConceptQuestions() {
    this.setState({
      displayNoConceptQuestions: !this.state.displayNoConceptQuestions,
    });
  },

  renderSearchBox() {
    const options = hashToCollection(this.props.questions.data);
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
      const searchBox = (<QuestionSelector options={formatted} placeholder="Search for a question" onChange={this.handleSearchChange} />);
      return searchBox;
    }
  },

  render() {
    const { questions, concepts, } = this.props;
    if (this.props.questions.hasreceiveddata && this.props.concepts.hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            <button onClick={this.props.dispatch.bind(null, loadAllResponseData())}>Load all responses</button>
            <button onClick={this.rematchAllQuestions}>Rematch all Questions</button>
            { this.renderModal() }
            { this.renderSearchBox() }
            <br />
            <label className="checkbox">
              <input type="checkbox" checked={this.state.displayNoConceptQuestions} onClick={this.toggleNoConceptQuestions} />
              Display questions with no valid concept
            </label>
            <br />
            <br />
            <QuestionsList displayNoConceptQuestions={this.state.displayNoConceptQuestions} questions={questions} concepts={concepts} baseRoute={'admin'} />
          </div>
        </section>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  },
});

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    responses: state.responses,
    routing: state.routing,
  };
}

export default connect(select)(Questions);
