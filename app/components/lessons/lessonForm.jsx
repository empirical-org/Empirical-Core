import React from 'react'
import { connect } from 'react-redux'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionSelector from 'react-select-search'
import SortableList from '../questions/sortableList/sortableList.jsx'
import LandingPageEditor from './landingPageEditor.jsx'
import _ from 'underscore'

const LessonForm = React.createClass({
  getInitialState: function () {
    const {currentValues} = this.props
    return {
      name: currentValues ? currentValues.name : "",
      introURL: currentValues ? currentValues.introURL || "" : "",
      landingPageHtml: currentValues ? currentValues.landingPageHtml || "" : "",
      selectedQuestions: currentValues && currentValues.questions ? currentValues.questions : [],
      flag: currentValues ? currentValues.flag : "Alpha",
      questionType: 'questions'
    }
  },

  submit: function () {
    this.props.submit({
      name: this.state.name,
      questions: this.state.selectedQuestions,
      landingPageHtml: this.state.landingPageHtml,
      flag: this.state.flag
    })
  },

  handleStateChange: function (key, event) {
    var changes = {};
    changes[key] = event.target.value;
    this.setState(changes)
  },

  handleChange: function (value) {
    const currentSelectedQuestions = this.state.selectedQuestions;
    const questionType = this.state.questionType || 'questions';
    let newSelectedQuestions;
    const changedQuestion = currentSelectedQuestions.find((q)=>q.key === value)
    if (!changedQuestion) {
      newSelectedQuestions = currentSelectedQuestions.concat([{key: value, questionType}]);
    } else {
      newSelectedQuestions = _.without(currentSelectedQuestions, changedQuestion)
    }
    this.setState({selectedQuestions: newSelectedQuestions})
  },

  handleSearchChange: function(e) {
    this.handleChange(e.value)
  },

  sortCallback: function(sortInfo){
    let newOrder = sortInfo.data.items.map((item)=>item.key);
    this.setState({selectedQuestions: newOrder});
  },

  renderQuestionSelect: function () {
    let questions;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if(this.state.selectedQuestions && this.state.selectedQuestions.length) {
      let that = this;
      let questionsList = this.state.selectedQuestions.map((question) => {
        // TODO: another area to refactor once we write a script to go through the db and add question type
        const questionType = question.questionType || 'questions'
        const nameKey = questionType === 'questions' ? 'prompt' : 'questionText'
        const questionKey = question.key || question
        return (
          <p className='sortable-list-item' key={questionKey}>
            {that.props[questionType].data[questionKey][nameKey].replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}
            {"\t\t"}
            <button onClick={this.handleChange.bind(null, questionKey)}>Delete</button>
          </p>
        )
      })
      questions = <SortableList key={this.state.selectedQuestions.length} sortCallback={this.sortCallback} data={questionsList}/>
    } else {
      questions = (<div>No questions</div>)
    }
    return questions;
  },

  renderSearchBox: function() {
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
  const questionType = this.state.questionType
    let options = hashToCollection(this.props[questionType].data)
    const concepts = this.props.concepts.data[0];
    if (options.length > 0) {
      options = _.filter(options, (option) => {
        return _.find(concepts, {uid: option.conceptID})
      }) // filter out questions with no valid concept
      const formatted = options.map((opt) => {
        const nameKey = questionType === 'questions' ? 'prompt' : 'questionText'
        return {name: opt[nameKey].replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, ""), value: opt.key}
      })
      return (<QuestionSelector key={this.state.questionType} options={formatted} placeholder="Search for a question"
                          onChange={this.handleSearchChange} />)
    }

  },

  handleSelect: function(e) {
    this.setState({flag: e.target.value})
  },

  handleSelectQuestionType: function(e) {
    this.setState({questionType: e.target.value}, ()=>console.log(this.state.questionType))
  },

  handleLPChange: function (e) {
    this.setState({landingPageHtml: e})
  },

  render: function () {
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
          onChange={this.handleStateChange.bind(null, "name")}
        />
      </p>
      <p className="control">
        <label className="label">Landing Page Content</label>
      </p>
      <LandingPageEditor text={this.state.landingPageHtml || ""} handleTextChange={this.handleLPChange}/>
      <br/>
      <p className="control">
        <label className="label">Flag</label>
        <span className="select">
          <select defaultValue={this.state.flag} onChange={this.handleSelect}>
            <option value="Alpha">Alpha</option>
            <option value="Beta">Beta</option>
            <option value="Production">Production</option>
            <option value="Archive">Archive</option>
          </select>
        </span>
      </p>
      <p className="control">
        <label className="label">Question Type</label>
        <span className="select">
          <select defaultValue={"questions"} onChange={this.handleSelectQuestionType}>
            <option value="questions">Sentence Combining</option>
            <option value="sentenceFragments">Sentence Fragment</option>
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
        <button className={"button is-primary " + this.props.stateSpecificClass} onClick={this.submit}>Submit</button>
      </p>
    </div>
    )
  }
})

function select(state) {
  return {
    questions: state.questions,
    concepts: state.concepts,
    sentenceFragments: state.sentenceFragments
  }
}

export default connect(select)(LessonForm)
