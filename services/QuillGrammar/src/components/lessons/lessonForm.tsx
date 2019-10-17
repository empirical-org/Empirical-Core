import * as React from 'react';
import QuestionSelector from 'react-select-search';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js'
import TextEditor from '../shared/textEditor'
import ConceptSelector from '../shared/conceptSelector'
import SortableList from '../shared/sortableList'
import { hashToCollection } from '../../helpers/hashToCollection'
import { GrammarActivity, Concepts, Concept } from '../../interfaces/grammarActivities'
import { Question } from '../../interfaces/questions'
import { ConceptReducerState } from '../../reducers/conceptsReducer'

interface LessonFormState {
  title: string;
  description: string;
  flag?: string;
  concepts?: Concepts;
  questions?: Array<Question>;
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

    this.state = {
      title: currentValues ? currentValues.title : '',
      description: currentValues ? currentValues.description || '' : '',
      flag: currentValues ? currentValues.flag : 'alpha',
      concepts: currentValues ? currentValues.concepts : {},
      questions: currentValues && currentValues.questions ? currentValues.questions : [],
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFlagSelect = this.handleFlagSelect.bind(this)
    this.addConcept = this.addConcept.bind(this)
    this.renderConceptRows = this.renderConceptRows.bind(this)
    this.removeConcept = this.removeConcept.bind(this)
    this.changeConceptQuantity = this.changeConceptQuantity.bind(this)
    this.renderQuestionSelect = this.renderQuestionSelect.bind(this)
    this.sortCallback = this.sortCallback.bind(this)
    this.renderSearchBox = this.renderSearchBox.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleQuestionChange = this.handleQuestionChange.bind(this)
  }

  submit() {
    const { title, concepts, description, flag, questions, } = this.state
    this.props.submit({
      title,
      concepts,
      description,
      flag,
      questions
    });
  }

  handleStateChange(key: string, event: React.ChangeEvent<{value: string}>) {
    const changes: LessonFormState = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

  handleSearchChange(e) {
    this.handleQuestionChange(e.value);
  }

  addConcept(concept: { value: string }) {
    const { value } = concept
    if (value) {
      const currentSelectedConcepts = this.state.concepts;
      const newSelectedConcepts = currentSelectedConcepts;
      newSelectedConcepts[value] = { quantity: 0 }
      this.setState({ concepts: newSelectedConcepts, });
    }
  }

  changeConceptQuantity(conceptUid: string, e: React.ChangeEvent<{value: string}>) {
    const quantity = e.target.value ? Number(e.target.value) : 0
    const newSelectedConcepts = this.state.concepts;
    newSelectedConcepts[conceptUid] = { quantity }
    this.setState({ concepts: newSelectedConcepts, });
  }

  removeConcept(conceptUid: string) {
    const newSelectedConcepts = this.state.concepts;
    delete newSelectedConcepts[conceptUid]
    this.setState({ concepts: newSelectedConcepts, });
  }

  handleFlagSelect(e: React.ChangeEvent<{value: string}>) {
    this.setState({ flag: e.target.value, });
  }

  handleDescriptionChange(e: string) {
    this.setState({ description: e, });
  }

  handleQuestionChange(value) {
    const currentQuestions = this.state.questions;
    let newQuestions;
    const changedQuestion = currentQuestions.find(q => q.key === value);
    if (!changedQuestion) {
      newQuestions = currentQuestions.concat([{ key: value }]);
    } else {
      newQuestions = _.without(currentQuestions, changedQuestion);
    }
    this.setState({ questions: newQuestions, });
  }

  sortCallback(sortInfo) {
    const newOrder = sortInfo.data.items.map(item => Object.assign({key: item.key}));
    this.setState({ questions: newOrder, });
  }

  renderQuestionSelect() {
    let questions;
    // select changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    if (this.state.questions && this.state.questions.length) {
      const questionsList = this.state.questions.map((question) => {
        const questionobj = this.props.questions.data[question.key];
        const prompt = questionobj ? questionobj.prompt : 'Question No Longer Exists';
        const promptOrTitle = questionobj.title || questionobj.prompt
        return (<p className="sortable-list-item" key={question.key}>
          {promptOrTitle}
          {'\t\t'}
          <button onClick={this.handleQuestionChange.bind(null, question.key)}>Delete</button>
        </p>
        );
      });
      return <SortableList key={Object.keys(this.state.questions).length} sortCallback={this.sortCallback} data={questionsList} />;
    } else {
      return <div>No questions</div>;
    }
  }

  renderSearchBox() {
    // options changes based on whether we are looking at 'questions' (should be refactored to sentenceCombining) or sentenceFragments
    let options = hashToCollection(this.props.questions.data);
    let formatted
    if (options.length > 0) {
        options = _.filter(options, option => option.flag !== "archived" && option.prompt); // filter out questions with no valid concept
        formatted = options.map(opt => ({ name: opt.prompt.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''), value: opt.key, }));
      return (<QuestionSelector
        options={formatted} placeholder="Search for a question"
        onChange={this.handleSearchChange}
      />);
    }
  }

  renderConceptRows(): Array<JSX.Element|undefined>|void {
    const conceptUids = this.state.concepts ? Object.keys(this.state.concepts) : []
    if (conceptUids.length > 0) {
      return conceptUids.map(c => {
        const conceptVal = this.state.concepts[c]
        const conceptAttributes = this.props.concepts.data['0'].find((concept: Concept) => concept.uid === c)
        if (conceptVal && conceptAttributes) {
          return <div key={c} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{conceptAttributes.displayName}</span>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <span>Quantity: </span>
                <input
                  defaultValue={conceptVal.quantity.toString()}
                  style={{ width: '50px' }}
                  onChange={(e) => this.changeConceptQuantity(c, e)}
                />
              </span>
              <span style={{ cursor: 'pointer' }} onClick={() => this.removeConcept(c)}>X</span>
            </span>
          </div>
        } else {
          return undefined
        }
      })
    }
  }
  //
  render() {
    return (
      <div className="box">
        <h4 className="title">Add New Activity</h4>
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
        <p className="control">
          <label className="label">Concept Selector</label>
          <ConceptSelector handleSelectorChange={this.addConcept}/>
        </p>
        {this.renderConceptRows()}
        <div className="control">
          <label className="label">Currently Selected Questions -- {`Total: ${this.state.questions.length}`}</label>
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
    concepts: state.concepts,
    questions: state.questions
  };
}

export default connect(select)(LessonForm);
