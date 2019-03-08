import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/questions';
import _ from 'underscore';
import { Link } from 'react-router';
import {
  Modal,
  hashToCollection,
  QuestionListByConcept,
  ArchivedButton
} from 'quill-component-library/dist/componentLibrary';
import Question from '../../libs/question';
import QuestionSelector from 'react-select-search';
import { push } from 'react-router-redux';
import respWithStatus from '../../libs/responseTools.js';
import { submitResponseEdit, setUpdatedResponse, deleteResponse } from '../../actions/responses';

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

    this.state = {
      displayNoConceptQuestions: false,
      showOnlyArchived: false,
      questions: {}
    }

    this.createNew = this.createNew.bind(this)
    this.submitNewQuestion = this.submitNewQuestion.bind(this)
    this.updateRematchedResponse = this.updateRematchedResponse.bind(this)
    this.mapConceptsToList = this.mapConceptsToList.bind(this)
    this.responsesWithStatusForQuestion = this.responsesWithStatusForQuestion.bind(this)
    this.rematchAllQuestions = this.rematchAllQuestions.bind(this)
    this.rematchAllResponses = this.rematchAllResponses.bind(this)
    this.rematchResponse = this.rematchResponse.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.toggleNoConceptQuestions = this.toggleNoConceptQuestions.bind(this)
    this.toggleShowArchived = this.toggleShowArchived.bind(this)
    this.renderSearchBox = this.renderSearchBox.bind(this)
  }

  componentWillReceiveProps(nextProps) {
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
    const questLength = _.keys(this.props.questions.data).length;
    _.each(hashToCollection(this.props.questions.data), (question, index) => {
      const percentage = index / questLength * 100;
      console.log(`Rematching: ${percentage}% complete`);
      if (ignoreList.indexOf(question.key) === -1 && question.conceptID) {
        console.log('Rematching Question: ', question.key);
        this.rematchAllResponses(question);
      } else {
        console.log('Ignoring');
      }
    });
    console.log('Finished Rematching All Questions');
  }

  rematchAllResponses(question) {
    // console.log('Rematching All Responses', question);
    const responsesWithStat = this.responsesWithStatusForQuestion(question.key);
    const weak = _.filter(responsesWithStat, resp => resp.statusCode > 1);
    weak.forEach((resp, index) => {
      const percentage = index / weak.length * 100;
      // console.log(`Rematching ${resp.key} | ${percentage}% complete`);
      this.rematchResponse(question, resp, responsesWithStat);
    });
    // console.log('Finished Rematching All Responses');
  }

  rematchResponse(question, response, responses) {
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
    // console.log('Rematched: t, u, o, n: ', changed, unmatched);
    // console.log(response);
    // console.log(newMatchedResponse.response);
    if (changed) {
      if (unmatched) {
        const newValues = {
          weak: false,
          text: response.text,
          count: response.count || 1,
          questionUID: response.questionUID,
          gradeIndex: `unmatched${response.questionUID}`,
        };
        // console.log("Unmatched: ", response.key)
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
        // console.log("Rematched: ", response.key)
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
  }

  handleSearchChange(e) {
    const action = push(`/admin/questions/${e.value}`);
    this.props.dispatch(action);
  }

  toggleNoConceptQuestions() {
    this.setState({
      displayNoConceptQuestions: !this.state.displayNoConceptQuestions,
    });
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }


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
  }

  render() {
    const { questions, concepts, } = this.props;
    if (questions.hasreceiveddata && concepts.hasreceiveddata) {
      return (
        <section className="section">
          <div className="container">
            <button onClick={this.rematchAllQuestions}>Rematch all Questions</button>
            { this.renderModal() }
            { this.renderSearchBox() }
            <br />
            <label className="checkbox">
              <input type="checkbox" checked={this.state.displayNoConceptQuestions} onClick={this.toggleNoConceptQuestions} />
              Display questions with no valid concept
            </label>
            <ArchivedButton showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} lessons={false} />
            <br />
            <br />
            <QuestionListByConcept
              questions={this.state.questions}
              concepts={concepts}
              displayNoConceptQuestions={this.state.displayNoConceptQuestions}
              showOnlyArchived={this.state.showOnlyArchived}
              basePath={'questions'}
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
