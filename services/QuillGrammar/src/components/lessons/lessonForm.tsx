import * as React from 'react';
import { connect } from 'react-redux';
import QuestionSelector from 'react-select-search';
import {
  hashToCollection,
  SortableList,
} from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import TextEditor from '../shared/textEditor'
import ConceptSelector from './conceptSelector'
import _ from 'underscore';

class LessonForm extends React.Component {
  constructor(props) {
    super(props)

    const { currentValues, } = props

    this.state = {
      title: currentValues ? currentValues.title : '',
      description: currentValues ? currentValues.description || '' : '',
      flag: currentValues ? currentValues.flag : 'alpha',
      concepts: currentValues ? currentValues.concepts : []
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFlagSelect = this.handleFlagSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  submit() {
    const { title, concepts, description, flag, } = this.state
    this.props.submit({
      title,
      concepts: concepts,
      description,
      flag
    });
  }
  // constructor(props) {
  //   super(props)
  //
  //   const { currentValues, } = props;
  //
  //   this.state = {
  //     title: currentValues ? currentValues.title : '',
  //     introURL: currentValues ? currentValues.introURL || '' : '',
  //     description: currentValues ? currentValues.description || '' : '',
  //     flag: currentValues ? currentValues.flag : 'alpha',
  //   }
  //
  //   this.submit = this.submit.bind(this)
  //   this.handleStateChange = this.handleStateChange.bind(this)
  //   this.handleChange = this.handleChange.bind(this)
  //   this.handleSearchChange = this.handleSearchChange.bind(this)
  //   this.sortCallback = this.sortCallback.bind(this)
  //   this.renderQuestionSelect = this.renderQuestionSelect.bind(this)
  //   this.renderSearchBox = this.renderSearchBox.bind(this)
  //   this.handleFlagSelect = this.handleFlagSelect.bind(this)
  //   this.handleFlagSelectQuestionType = this.handleFlagSelectQuestionType.bind(this)
  //   this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
  // }
  //
  // submit() {
  //   const { title, concepts, description, flag, } = this.state
  //   this.props.submit({
  //     title,
  //     questions: concepts,
  //     description,
  //     flag
  //   });
  // }
  //
  handleStateChange(key, event) {
    const changes = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }
  //
  handleChange(value, number) {
    const currentSelectedConcepts = this.state.concepts;
    let newSelectedConcepts = currentSelectedConcepts;
    const changedConcept = currentSelectedConcepts[value]
    // const changedConcept = currentSelectedConcepts.find(q => q.key === value);
    if (!changedConcept) {
      newSelectedConcepts = currentSelectedConcepts
    //   newSelectedConcepts = currentSelectedConcepts.concat([{ key: value, questionType: this.state.questionType, }]);
    } else {
    //   newSelectedConcepts = _.without(currentSelectedConcepts, changedConcept);
    }
    this.setState({ concepts: newSelectedConcepts, });
  }

  handleSearchChange(e) {
    this.handleChange(e.value);
  }
  //
  // sortCallback(sortInfo) {
  //   const newOrder = sortInfo.data.items.map(item => Object.assign({key: item.key, questionType: item.props.questionType}));
  //   this.setState({ concepts: newOrder, });
  // }
  //
  // renderQuestionSelect() {
  //   let questions;
  //   // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
  //   if (this.state.concepts && this.state.concepts.length) {
  //     const questionsList = this.state.concepts.map((question) => {
  //       const questionobj = this.props.questions.data[question.key];
  //       const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
  //       const promptOrTitle = question.questionType === 'titleCards' ? questionobj.title : prompt
  //       return (<p className="sortable-list-item" key={question.key} questionType={question.questionType}>
  //         {promptOrTitle}
  //         {'\t\t'}
  //         <button onClick={this.handleChange.bind(null, question.key)}>Delete</button>
  //       </p>
  //       );
  //     });
  //     return <SortableList key={this.state.concepts.length} sortCallback={this.sortCallback} data={questionsList} />;
  //   } else {
  //     return <div>No questions</div>;
  //   }
  // }
  //
  renderSearchBox() {
    let options = hashToCollection(this.props.concepts.data['0']);
    const concepts = this.props.concepts && this.props.concepts.data ? this.props.concepts.data[0] : [];
    console.log('Options: ', options);
    let formatted
    if (options.length > 0) {
      formatted = options.map(opt => ({ title: opt.displayName, value: opt.uid, }));
    }
    return (<QuestionSelector
      options={formatted} placeholder="Search for a concept"
      onChange={this.handleSearchChange}
    />);
  }

  handleFlagSelect(e) {
    this.setState({ flag: e.target.value, });
  }
  //
  // handleFlagSelectQuestionType(e) {
  //   this.setState({ questionType: e.target.value, });
  // }
  //
  handleDescriptionChange(e) {
    this.setState({ description: e, });
  }

  renderConceptSelector() {
    const times = Object.keys(this.state.concepts).length + 1
    const conceptSelectorArray = []
    for(let i=0; i < times; i++){
      conceptSelectorArray.push(<ConceptSelector key={i} handleSelectorChange={this.handleChange}/>)
    }
    return conceptSelectorArray
  }
  //
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
            value={this.state.title}
            onChange={this.handleStateChange.bind(null, 'title')}
          />
        </p>
        <p className="control">
          <label className="label">Description</label>
        </p>
        <TextEditor
          text={this.state.description || ''}
          handleTextChange={this.handleDescriptionChange}
          EditorState={EditorState}
          ContentState={ContentState}
        />
        <br />
        <p className="control">
          <label className="label">Flag</label>
          <span className="select">
            <select defaultValue={this.state.flag} onChange={this.handleFlagSelect}>
              <option value="alpha">alpha</option>
              <option value="beta">beta</option>
              <option value="production">production</option>
              <option value="archived">archived</option>
            </select>
          </span>
        </p>
        {this.renderConceptSelector()}
        <p className="control">
          <button className={`button is-primary ${this.props.stateSpecificClass}`} onClick={this.submit}>Submit</button>
        </p>
      </div>
    );
  }
}

function select(state) {
  return {
    concepts: state.concepts
  };
}

export default connect(select)(LessonForm);
