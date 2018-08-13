import * as React from 'react';
import { connect } from 'react-redux';
import QuestionSelector from 'react-select-search';
import {
  hashToCollection,
  SortableList,
  TextEditor
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import _ from 'underscore';

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
      questionType: 'questions',
      modelConceptUID: currentValues ? currentValues.modelConceptUID : null
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.sortCallback = this.sortCallback.bind(this)
    this.renderQuestionSelect = this.renderQuestionSelect.bind(this)
    this.renderSearchBox = this.renderSearchBox.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleSelectQuestionType = this.handleSelectQuestionType.bind(this)
    this.handleLPChange = this.handleLPChange.bind(this)
  }

  submit() {
    const { name, selectedQuestions, landingPageHtml, flag, modelConceptUID, } = this.state
    this.props.submit({
      name,
      questions: selectedQuestions,
      landingPageHtml,
      flag,
      modelConceptUID
    });
  }

  handleStateChange(key, event) {
    const changes = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

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
  }

  handleSearchChange(e) {
    this.handleChange(e.value);
  }

  sortCallback(sortInfo) {
    const newOrder = sortInfo.data.items.map(item => Object.assign({key: item.key, questionType: item.props.questionType}));
    this.setState({ selectedQuestions: newOrder, });
  }

  renderQuestionSelect() {
    let questions;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (this.state.selectedQuestions && this.state.selectedQuestions.length) {
      const questionsList = this.state.selectedQuestions.map((question) => {
        const questionobj = this.props[question.questionType].data[question.key];
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        const promptOrTitle = question.questionType === 'titleCards' ? questionobj.title : prompt
        return (<p className="sortable-list-item" key={question.key} questionType={question.questionType}>
          {promptOrTitle}
          {'\t\t'}
          <button onClick={this.handleChange.bind(null, question.key)}>Delete</button>
        </p>
        );
      });
      return <SortableList key={this.state.selectedQuestions.length} sortCallback={this.sortCallback} data={questionsList} />;
    } else {
      return <div>No questions</div>;
    }
  }

  renderSearchBox() {
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    const questionType = this.state.questionType;
    let options = hashToCollection(this.props[questionType].data);
    const concepts = this.props.concepts.data[0];
    console.log('Options: ', options);
    let formatted
    if (options.length > 0) {
      if (questionType !== 'titleCards') {
        options = _.filter(options, option => _.find(concepts, { uid: option.conceptID, }) && (option.flag !== "archived")); // filter out questions with no valid concept
        formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      } else {
        formatted = options.map((opt) => { return { name: opt.title, value: opt.key } })
      }
      return (<QuestionSelector
        key={questionType} options={formatted} placeholder="Search for a question"
        onChange={this.handleSearchChange}
      />);
    }
  }

  handleSelect(e) {
    this.setState({ flag: e.target.value, });
  }

  handleSelectQuestionType(e) {
    this.setState({ questionType: e.target.value, });
  }

  handleLPChange(e) {
    this.setState({ landingPageHtml: e, });
  }

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
        <TextEditor
          text={this.state.landingPageHtml || ''}
          handleTextChange={this.handleLPChange}
          EditorState={EditorState}
          ContentState={ContentState}
        />
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
    concepts: state.concepts
  };
}

export default connect(select)(LessonForm);
