import React from 'react';
import { connect } from 'react-redux';
import { hashToCollection } from '../../libs/hashToCollection';
import QuestionSelector from 'react-select-search';
import SortableList from '../questions/sortableList/sortableList.jsx';
import LandingPageEditor from './landingPageEditor.jsx';
import ChooseModelContainer from './chooseModelContainer.jsx'
import _ from 'underscore';

const LessonForm = React.createClass({
  getInitialState() {
    const { currentValues, } = this.props;
    return {
      name: currentValues ? currentValues.name : '',
      introURL: currentValues ? currentValues.introURL || '' : '',
      landingPageHtml: currentValues ? currentValues.landingPageHtml || '' : '',
      selectedQuestions: currentValues && currentValues.questions ? currentValues.questions : [],
      flag: currentValues ? currentValues.flag : 'alpha',
      questionType: 'questions',
      modelConceptUID: currentValues ? currentValues.modelConceptUID : null
    };
  },

  submit() {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, } = this.state
    this.props.submit({
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID
    });
  },

  handleStateChange(key, event) {
    const changes = {};
    changes[key] = event.target.value;
    this.setState(changes);
  },

  handleChange(value) {
    const currentSelectedQuestions = this.state.selectedQuestions;
    let newSelectedQuestions;
    const changedQuestion = currentSelectedQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newSelectedQuestions = currentSelectedQuestions.concat([{ key: value, questionType: this.state.questionType, }]);
    } else {
      newSelectedQuestions = _.without(currentSelectedQuestions, changedQuestion);
    }
    this.setState({ selectedQuestions: newSelectedQuestions, });
  },

  handleSearchChange(e) {
    this.handleChange(e.value);
  },

  sortCallback(sortInfo) {
    const newOrder = sortInfo.data.items.map(item => Object.assign({key: item.key, questionType: item.props.questionType}));
    this.setState({ selectedQuestions: newOrder, });
  },

  renderQuestionSelect() {
    let questions;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (this.state.selectedQuestions && this.state.selectedQuestions.length) {
      const questionsList = this.state.selectedQuestions.map((question) => {
        const questionobj = this.props[question.questionType].data[question.key];
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        return (<p className="sortable-list-item" key={question.key} questionType={question.questionType}>
          {prompt}
          {'\t\t'}
          <button onClick={this.handleChange.bind(null, question.key)}>Delete</button>
        </p>
        );
      });
      return <SortableList key={this.state.selectedQuestions.length} sortCallback={this.sortCallback} data={questionsList} />;
    } else {
      return <div>No questions</div>;
    }
  },

  renderSearchBox() {
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    const questionType = this.state.questionType;
    let options = hashToCollection(this.props[questionType].data);
    const concepts = this.props.concepts.data[0];
    console.log('Options: ', options);
    if (options.length > 0) {
      options = _.filter(options, option => _.find(concepts, { uid: option.conceptID, }) && (option.flag !== "archived")); // filter out questions with no valid concept
      const formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      return (<QuestionSelector
        key={questionType} options={formatted} placeholder="Search for a question"
        onChange={this.handleSearchChange}
      />);
    }
  },

  handleSelect(e) {
    this.setState({ flag: e.target.value, });
  },

  handleSelectQuestionType(e) {
    this.setState({ questionType: e.target.value, });
  },

  handleLPChange(e) {
    this.setState({ landingPageHtml: e, });
  },

  render() {
    return (
      <div className="box">
        <h4 className="title">Add New Lesson</h4>
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            type="text"
            placeholder="Text input"
            value={this.state.name}
            onChange={this.handleStateChange.bind(null, 'name')}
          />
        </p>
        <p className="control">
          <label className="label">Landing Page Content</label>
        </p>
        <LandingPageEditor text={this.state.landingPageHtml || ''} handleTextChange={this.handleLPChange} />
        <br />
        <p className="control">
          <label className="label">Flag</label>
          <span className="select">
            <select defaultValue={this.state.flag} onChange={this.handleSelect}>
              <option value="alpha">alpha</option>
              <option value="beta">beta</option>
              <option value="production">production</option>
              <option value="archived">archived</option>
            </select>
          </span>
        </p>
        <p className="control">
          <label className="label">Question Type</label>
          <span className="select">
            <select defaultValue={'questions'} onChange={this.handleSelectQuestionType}>
              <option value="questions">Sentence Combining</option>
              <option value="sentenceFragments">Sentence Fragment</option>
              <option value="fillInBlank">Fill In the Blank</option>
            </select>
          </span>
        </p>
        <div className="control">
          <label className="label">Currently Selected Questions -- {`Total: ${this.state.selectedQuestions.length}`}</label>
          {this.renderQuestionSelect()}
        </div>
        <label className="label">All Questions</label>
        {this.renderSearchBox()}
        <br />
        <ChooseModelContainer
          updateModelConcept={modelConceptUID => this.setState({ modelConceptUID })}
          modelConceptUID={this.state.modelConceptUID}
          conceptsFeedback={this.props.conceptsFeedback}
        />
        <p className="control">
          <button className={`button is-primary ${this.props.stateSpecificClass}`} onClick={this.submit}>Submit</button>
        </p>
      </div>
    );
  },
});

function select(state) {
  return {
    questions: state.questions,
    concepts: state.concepts,
    sentenceFragments: state.sentenceFragments,
    conceptsFeedback: state.conceptsFeedback,
    fillInBlank: state.fillInBlank
  };
}

export default connect(select)(LessonForm);
