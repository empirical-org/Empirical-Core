import * as React from 'react';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js'
import ConceptSelector from '../shared/conceptSelector'
import TextEditor from '../shared/textEditor'
import { ProofreaderActivity, Concepts, Concept } from '../../interfaces/proofreaderActivities'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import PassageCreator from './passageCreator'
import EditGenerator from './editGenerator'

interface LessonFormState {
  title: string;
  description: string;
  flag?: string;
  underlineErrorsInProofreader: boolean;
  passage: string;
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
      passage: currentValues ? currentValues.passage : '',
      underlineErrorsInProofreader: currentValues ? currentValues.underlineErrorsInProofreader : false
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFlagSelect = this.handleFlagSelect.bind(this)
    this.toggleUnderline = this.toggleUnderline.bind(this)
    this.handlePassageChange = this.handlePassageChange.bind(this)
  }

  submit() {
    const { title, description, flag, passage, underlineErrorsInProofreader } = this.state
    this.props.submit({
      title,
      description,
      flag,
      passage,
      underlineErrorsInProofreader
    });
  }

  handleStateChange(key: string, event: React.ChangeEvent<{value: string}>) {
    const changes: LessonFormState = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

  handleFlagSelect(e: React.ChangeEvent<{value: string}>) {
    this.setState({ flag: e.target.value, });
  }

  toggleUnderline(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ underlineErrorsInProofreader: !this.state.underlineErrorsInProofreader });
  }

  handleDescriptionChange(e: string) {
    this.setState({ description: e, });
  }

  handlePassageChange(e: string) {
    this.setState({ passage: e, });
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
        <p className="control">
          <label className="label">Show Underlines</label>
          <input
            name="showUnderlines"
            type="checkbox"
            checked={this.state.underlineErrorsInProofreader}
            onChange={this.toggleUnderline}
          />
        </p>
        <EditGenerator/>
        <p className="control">
          <label className="label">Passage</label>
          <PassageCreator onChange={this.handlePassageChange} originalPassage={this.props.currentValues ? this.props.currentValues.passage : ' '}/>
        </p>
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
