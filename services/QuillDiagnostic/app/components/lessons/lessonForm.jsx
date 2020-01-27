import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuestionSelector from 'react-select-search';
import {
  hashToCollection,
  SortableList,
  TextEditor
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import ChooseModel from './chooseModel.jsx'
import _ from 'underscore';
import { DeleteButton, NameInput } from './lessonFormComponents';

export class LessonForm extends Component {
  constructor(props) {
    super(props)

    const { currentValues, } = props;

    this.state = {
      name: currentValues ? currentValues.name : '',
      introURL: currentValues ? currentValues.introURL || '' : '',
      landingPageHtml: currentValues ? currentValues.landingPageHtml || '' : '',
      selectedQuestions: currentValues && currentValues.questions ? currentValues.questions : [],
      flag: currentValues ? currentValues.flag : 'alpha',
      questionType: 'questions',
      modelConceptUID: currentValues ? currentValues.modelConceptUID : null,
      isELL: currentValues ? currentValues.isELL || false : false
    }
  }

  handleSubmit = () => {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, isELL } = this.state;
    const { submit } = this.props;
    submit({
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID,
      isELL
    });
  }

  handleStateChange = (key, event) => {
    const changes = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

  handleChange = (value) => {
    const { selectedQuestions, questionType } = this.state;
    let newSelectedQuestions;
    const changedQuestion = selectedQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newSelectedQuestions = selectedQuestions.concat([{ key: value, questionType: questionType, }]);
    } else {
      newSelectedQuestions = _.without(selectedQuestions, changedQuestion);
    }
    this.setState({ selectedQuestions: newSelectedQuestions, });
  }

  handleSearchChange = (e) => {
    this.handleChange(e.value);
  }

  sortCallback = (sortInfo) => {
    const newOrder = sortInfo.data.items.map(item => Object.assign({key: item.key, questionType: item.props.questionType}));
    this.setState({ selectedQuestions: newOrder, });
  }

  renderQuestionSelect = () => {
    const { selectedQuestions } = this.state;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (selectedQuestions && selectedQuestions.length) {
      const questionsList = selectedQuestions.map((question) => {
        const questionobj = this.props[question.questionType].data[question.key]; // eslint-disable-line react/destructuring-assignment
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        const promptOrTitle = question.questionType === 'titleCards' ? questionobj.title : prompt
        return (<p className="sortable-list-item" key={question.key} questionType={question.questionType}>
          {promptOrTitle}
          {'\t\t'}
          <DeleteButton onHandleChange={this.handleChange} questionId={question.key} />
        </p>
        );
      });
      return <SortableList data={questionsList} id="currently-selected-questions" key={selectedQuestions.length} sortCallback={this.sortCallback} />;
    } else {
      return <div id="currently-selected-questions">No questions</div>;
    }
  }

  renderSearchBox = () => {
    const { questionType } = this.state;
    const { data } = this.props.concepts; // eslint-disable-line react/destructuring-assignment
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    let options = hashToCollection(this.props[questionType].data); // eslint-disable-line react/destructuring-assignment
    const concepts = data[0];
    let formatted
    if (options.length > 0) {
      if (questionType !== 'titleCards') {
        options = _.filter(options, option => _.find(concepts, { uid: option.conceptID, }) && (option.flag !== "archived")); // filter out questions with no valid concept
        formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      } else {
        formatted = options.map((opt) => { return { name: opt.title, value: opt.key } })
      }
      return (<QuestionSelector
        id="all-questions"
        key={questionType}
        onChange={this.handleSearchChange}
        options={formatted}
        placeholder="Search for a question"
      />);
    }
  }

  handleSelectFlag = (e) => {
    this.setState({ flag: e.target.value, });
  }

  handleSelectQuestionType = (e) => {
    this.setState({ questionType: e.target.value, });
  }

  handleLPChange = (e) => {
    this.setState({ landingPageHtml: e, });
  }

  handleELLChange = () => {
    const { isELL } = this.state;
    this.setState({ isELL: !isELL });
  }

  handleUpdateModelConcept = (uid) => {
    this.setState({ modelConceptUID: uid });
  }

  render() {
    const { flag, isELL, landingPageHtml, modelConceptUID, name, selectedQuestions } = this.state;
    const { conceptsFeedback, stateSpecificClass } = this.props;
    return (
      <div className="box">
        <h4 className="title">Add New Activity</h4>
        <p className="control">
          <NameInput name={name} onHandleChange={this.handleStateChange} />
        </p>
        <p className="control">
          <label className="label" htmlFor="landing-page-content">
            Landing Page Content
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={this.handleLPChange} // eslint-disable-line react/jsx-handler-names
              id="landing-page-content"
              text={landingPageHtml || ''}
            />
          </label>
        </p>
        <br />
        <p className="control">
          <label className="label" htmlFor="flag">
            Flag
            <span className="select">
              <select defaultValue={flag} onBlur={this.handleSelectFlag}>
                <option value="alpha">alpha</option>
                <option value="beta">beta</option>
                <option value="production">production</option>
                <option value="archived">archived</option>
              </select>
            </span>
          </label>
        </p>
        <p className="control">
          <label className="label" htmlFor="ell-check-input">
            Is ELL?
            <span className="select">
              <input
                aria-label="ell-check-input"
                checked={isELL}
                onChange={this.handleELLChange}
                type="checkbox"
              />
            </span>
          </label>
        </p>
        <p className="control">
          <label className="label" htmlFor="question-type">
            Question Type
            <span className="select">
              <select defaultValue="questions" id="question-type" onBlur={this.handleSelectQuestionType}>
                <option value="questions">Sentence Combining</option>
                <option value="sentenceFragments">Sentence Fragment</option>
                <option value="fillInBlank">Fill In the Blank</option>
                <option value="titleCards">Title Cards</option>
              </select>
            </span>
          </label>
        </p>
        <div className="control">
          <label className="label" htmlFor="currently-selected-questions">
            Currently Selected Questions -- {`Total: ${selectedQuestions.length}`}
            {this.renderQuestionSelect()}
          </label>
        </div>
        <label className="label" htmlFor="all-questions">
          All Questions
          {this.renderSearchBox()}
        </label>
        <br />
        <ChooseModel
          conceptsFeedback={conceptsFeedback}
          modelConceptUID={modelConceptUID}
          onUpdateModelConcept={this.handleUpdateModelConcept}
        />
        <p className="control">
          <button className={`button is-primary ${stateSpecificClass}`} onClick={this.handleSubmit} type="submit">Submit</button>
        </p>
      </div>
    );
  }
};

function select({ questions, concepts, sentenceFragments, conceptsFeedback, fillInBlank, titleCards }) {
  return {
    questions,
    concepts,
    sentenceFragments,
    conceptsFeedback,
    fillInBlank,
    titleCards
  };
}

export default connect(select)(LessonForm);
