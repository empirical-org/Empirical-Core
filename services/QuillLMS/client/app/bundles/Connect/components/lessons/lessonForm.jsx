import { ContentState, EditorState } from 'draft-js';
import React from 'react';
import { connect } from 'react-redux';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import _ from 'underscore';
import ChooseModelContainer from './chooseModelContainer.jsx';

import {
    hashToCollection,
    SortableList,
    TextEditor
} from '../../../Shared/index';

class LessonForm extends React.Component {
  constructor(props) {
    super(props)

    const { currentValues, } = props;

    this.state = {
      name: currentValues ? currentValues.name : '',
      introURL: currentValues ? currentValues.introURL || '' : '',
      landingPageHtml: currentValues ? currentValues.landingPageHtml || '' : '',
      selectedQuestions: currentValues && currentValues.questions ? currentValues.questions : [],
      flag: currentValues ? currentValues.flag : 'alpha',
      questionType: currentValues ? currentValues.questionType || 'questions' : 'questions',
      modelConceptUID: currentValues ? currentValues.modelConceptUID : null
    }
  }

  handleChange = value => {
    const currentSelectedQuestions = this.state.selectedQuestions;
    let newSelectedQuestions;
    const changedQuestion = currentSelectedQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newSelectedQuestions = currentSelectedQuestions.concat([{ key: value, questionType: this.state.questionType, }]);
    } else {
      newSelectedQuestions = _.without(currentSelectedQuestions, changedQuestion);
    }
    this.setState({ selectedQuestions: newSelectedQuestions, });
  };

  handleLPChange = e => {
    this.setState({ landingPageHtml: e, });
  };

  handleSearchChange = value => {
    this.handleChange(value);
  };

  handleSelect = e => {
    this.setState({ flag: e.target.value, });
  };

  handleSelectQuestionType = e => {
    this.setState({ questionType: e.target.value, });
  };

  handleStateChange = (key, event) => {
    const changes = {};
    changes[key] = event.target.value;
    this.setState(changes);
  };

  sortCallback = sortInfo => {
    const newOrder = sortInfo.map(item => Object.assign({key: item.key, questionType: item.props.questionType}));
    this.setState({ selectedQuestions: newOrder, });
  };

  submit = () => {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, questionType } = this.state
    this.props.submit({
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID,
      questionType
    });
  };

  renderQuestionSelect = () => {
    let questions;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (this.state.selectedQuestions && this.state.selectedQuestions.length) {
      const questionsList = this.state.selectedQuestions.map((question) => {
        const questionobj = this.props[question.questionType].data[question.key];
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        const promptOrTitle = question.questionType === 'titleCards' ? questionobj.title : prompt
        return (
          <p className="sortable-list-item" key={question.key} questionType={question.questionType}>
            {promptOrTitle}
            {'\t\t'}
            <button onClick={this.handleChange.bind(null, question.key)}>Delete</button>
          </p>
        );
      });
      return <SortableList data={questionsList} key={this.state.selectedQuestions.length} sortCallback={this.sortCallback} />;
    } else {
      return <div>No questions</div>;
    }
  };

  renderSearchBox = () => {
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    const questionType = this.state.questionType;
    let options = hashToCollection(this.props[questionType].data);
    const concepts = this.props.concepts.data[0];
    let formatted
    if (options.length > 0) {
      if (questionType !== 'titleCards') {
        options = _.filter(options, option => _.find(concepts, { uid: option.conceptID, }) && (option.flag !== "archived")); // filter out questions with no valid concept
        formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      } else {
        formatted = options.map((opt) => { return { name: opt.title, value: opt.key } })
      }
      return (
        <SelectSearch
          filterOptions={fuzzySearch}
          key={questionType}
          onChange={this.handleSearchChange}
          options={formatted}
          placeholder="Search for a question"
          search={true}
        />
      );
    }
  };

  render() {
    const { questionType } = this.state
    return (
      <div className="box">
        <h4 className="title">Add New Activity</h4>
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            onChange={this.handleStateChange.bind(null, 'name')}
            placeholder="Text input"
            type="text"
            value={this.state.name}
          />
        </p>
        <p className="control">
          <label className="label">Landing Page Content</label>
        </p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handleLPChange}
          text={this.state.landingPageHtml || ''}
        />
        <br />
        <p className="control">
          <label className="label">Flag</label>
          <span className="select">
            <select defaultValue={this.state.flag} onChange={this.handleSelect}>
              <option value="alpha">alpha</option>
              <option value="beta">beta</option>
              <option value="gamma">gamma</option>
              <option value="production">production</option>
              <option value="archived">archived</option>
            </select>
          </span>
        </p>
        <p className="control">
          <label className="label">Question Type</label>
          <span className="select">
            <select defaultValue={questionType} onChange={this.handleSelectQuestionType}>
              <option value="questions">Sentence Combining</option>
              <option value="sentenceFragments">Sentence Fragment</option>
              <option value="fillInBlank">Fill In the Blank</option>
              <option value="titleCards">Title Cards</option>
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
          conceptsFeedback={this.props.conceptsFeedback}
          modelConceptUID={this.state.modelConceptUID}
          updateModelConcept={modelConceptUID => this.setState({ modelConceptUID })}
        />
        <p className="control">
          <button className={`button is-primary ${this.props.stateSpecificClass}`} onClick={this.submit}>Submit</button>
        </p>
      </div>
    );
  }
}

function select(state) {
  return {
    questions: state.questions,
    concepts: state.concepts,
    sentenceFragments: state.sentenceFragments,
    conceptsFeedback: state.conceptsFeedback,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards
  };
}

export default connect(select)(LessonForm);
