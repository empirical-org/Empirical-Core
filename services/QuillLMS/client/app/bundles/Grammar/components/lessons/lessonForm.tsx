import * as React from 'react';
import SelectSearch from 'react-select-search';
import { fuzzySearch } from 'react-select-search';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js'

import ConceptSelector from '../shared/conceptSelector'
import { Concepts, Concept } from '../../interfaces/grammarActivities'
import { Question } from '../../interfaces/questions'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { hashToCollection, SortableList, TextEditor, } from '../../../Shared/index'

interface LessonFormState {
  title: string;
  description: string;
  landingPageHtml?: string;
  flag?: string;
  activityConcepts?: Concepts;
  activityQuestions?: Array<Question>;
}

interface LessonFormProps {
  submit: Function;
  concepts: ConceptReducerState;
  stateSpecificClass?: string;
  currentValues?: LessonFormState|null;
  lesson: LessonFormState|null;
}

class LessonForm extends React.Component<LessonFormProps, LessonFormState> {
  constructor(props: LessonFormProps) {
    super(props)

    const { currentValues, } = props

    const { title, description, flag, concepts, questions, landingPageHtml, } = currentValues || {}

    this.state = {
      title: title || '',
      description: description || '',
      flag: flag || 'alpha',
      activityConcepts: concepts || {},
      activityQuestions: questions || [],
      landingPageHtml: landingPageHtml || ''
    }
  }

  submit = () => {
    const { submit, } = this.props
    const { title, activityConcepts, description, flag, activityQuestions, landingPageHtml, } = this.state
    submit({
      title,
      concepts: activityConcepts,
      description,
      flag,
      questions: activityQuestions,
      landingPageHtml
    });
  }

  handleStateChange = (key: string, event: React.ChangeEvent<{value: string}>) => {
    const changes: LessonFormState = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

  addConcept = (concept: { value: string }) => {
    const { activityConcepts, } = this.state
    const { value } = concept
    if (value) {
      const currentSelectedConcepts = activityConcepts;
      const newSelectedConcepts = currentSelectedConcepts;
      newSelectedConcepts[value] = { quantity: 0 }
      this.setState({ activityConcepts: newSelectedConcepts, });
    }
  }

  changeConceptQuantity = (conceptUid: string, e: React.ChangeEvent<{value: string}>) => {
    const { activityConcepts, } = this.state
    const quantity = e.target.value ? Number(e.target.value) : 0
    const newSelectedConcepts = activityConcepts;
    newSelectedConcepts[conceptUid] = { quantity }
    this.setState({ activityConcepts: newSelectedConcepts, });
  }

  removeConcept = (conceptUid: string) => {
    const { activityConcepts, } = this.state
    const newSelectedConcepts = activityConcepts;
    delete newSelectedConcepts[conceptUid]
    this.setState({ activityConcepts: newSelectedConcepts, });
  }

  handleFlagSelect = (e: React.ChangeEvent<{value: string}>) => {
    this.setState({ flag: e.target.value, });
  }

  handleDescriptionChange = (e: string) => {
    this.setState({ description: e, });
  }

  handleLandingPageHTMLChange = (e: string) => {
    this.setState({ landingPageHtml: e, });
  }

  handleQuestionChange = (value) => {
    const { activityQuestions, } = this.state;
    let newQuestions;
    const changedQuestion = activityQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newQuestions = activityQuestions.concat([{ key: value }]);
    } else {
      newQuestions = _.without(activityQuestions, changedQuestion);
    }
    this.setState({ activityQuestions: newQuestions, });
  }

  sortCallback = (sortInfo) => {
    const newOrder = sortInfo.map(item => Object.assign({key: item.key}));
    this.setState({ activityQuestions: newOrder, });
  }

  renderQuestionSelect = () => {
    const { activityQuestions, } = this.state
    const { questions, } = this.props
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (activityQuestions && activityQuestions.length) {
      const questionsList = activityQuestions.map((question) => {
        const questionobj = questions.data[question.key];
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        const promptOrTitle = questionobj.title || questionobj.prompt
        return (
          <p className="sortable-list-item" key={question.key}>
            {promptOrTitle}
            {'\t\t'}
            <button onClick={this.handleQuestionChange.bind(null, question.key)}>Delete</button>
          </p>
        );
      });
      return <SortableList data={questionsList} key={Object.keys(activityQuestions).length} sortCallback={this.sortCallback} />;
    } else {
      return <div>No questions</div>;
    }
  }

  renderSearchBox = () => {
    const { questions, } = this.props
    let options = hashToCollection(questions.data);
    let formatted
    if (options.length > 0) {
      options = _.filter(options, option => option.flag !== "archived" && option.prompt); // filter out questions with no valid concept
      formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      return (
        <SelectSearch
          filterOptions={fuzzySearch}
          onChange={this.handleQuestionChange}
          options={formatted}
          placeholder="Search for a question"
          search={true}
        />
      );
    }
  }

  renderConceptRows = (): Array<JSX.Element|undefined>|void => {
    const { activityConcepts, } = this.state
    const { concepts, } = this.props
    const conceptUids = activityConcepts ? Object.keys(activityConcepts) : []
    if (conceptUids.length > 0) {
      return conceptUids.map(c => {
        const conceptVal = activityConcepts[c]
        const conceptAttributes = concepts.data['0'].find((concept: Concept) => concept.uid === c)
        if (conceptVal && conceptAttributes) {
          return (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{conceptAttributes.displayName}</span>
              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <span>Quantity: </span>
                  <input
                    defaultValue={conceptVal.quantity.toString()}
                    onChange={(e) => this.changeConceptQuantity(c, e)}
                    style={{ width: '50px' }}
                  />
                </span>
                <span onClick={() => this.removeConcept(c)} style={{ cursor: 'pointer' }}>X</span>
              </span>
            </div>
          )
        } else {
          return undefined
        }
      })
    }
  }

  render() {
    const { stateSpecificClass, } = this.props
    const { title, description, landingPageHtml, flag, activityQuestions, activityConcepts, } = this.state
    return (
      <div className="box">
        <h4 className="title">Add New Activity</h4>
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            onChange={this.handleStateChange.bind(null, 'title')}
            placeholder="Text input"
            type="text"
            value={title}
          />
        </p>
        <p className="control">
          <label className="label">Description</label>
        </p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handleDescriptionChange}
          text={description || ''}
        />
        <br />
        <p className="control">
          <label className="label">Landing Page HTML</label>
        </p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handleLandingPageHTMLChange}
          text={landingPageHtml || ''}
        />
        <br />
        <p className="control">
          <label className="label">Flag</label>
          <span className="select">
            <select defaultValue={flag} onChange={this.handleFlagSelect}>
              <option value="alpha">alpha</option>
              <option value="beta">beta</option>
              <option value="gamma">gamma</option>
              <option value="production">production</option>
              <option value="archived">archived</option>
            </select>
          </span>
        </p>
        <p className="control">
          <label className="label">Concept Selector</label>
          <ConceptSelector handleSelectorChange={this.addConcept} />
        </p>
        {this.renderConceptRows()}
        <div className="control">
          <label className="label">Currently Selected Questions -- {`Total: ${activityQuestions.length}`}</label>
          {this.renderQuestionSelect()}
        </div>
        <label className="label">All Questions</label>
        {this.renderSearchBox()}
        <br />
        <p className="control">
          <button className={`button is-primary ${stateSpecificClass}`} onClick={this.submit}>Submit</button>
        </p>
      </div>
    );
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions
  };
}

export default connect(select)(LessonForm);
