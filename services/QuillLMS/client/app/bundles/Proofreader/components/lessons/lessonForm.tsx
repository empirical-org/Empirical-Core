import * as React from 'react';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js'
import ConceptSelector from '../shared/conceptSelector'
import TextEditor from '../shared/textEditor'
import { ProofreaderActivity, Concepts, Concept } from '../../interfaces/proofreaderActivities'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import EditGenerator from './editGenerator'

interface LessonFormState {
  title: string;
  description: string;
  flag?: string;
  underlineErrorsInProofreader: boolean;
  passage: string;
  readingLevel?: string;
}

interface LessonFormProps {
  submit: Function;
  concepts: ConceptReducerState;
  stateSpecificClass?: string;
  currentValues?: LessonFormState;
  lesson?: LessonFormState;
  returnToView: (e?) => void;
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
      underlineErrorsInProofreader: currentValues ? currentValues.underlineErrorsInProofreader : false,
      readingLevel: currentValues ? currentValues.readingLevel : ''
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFlagSelect = this.handleFlagSelect.bind(this)
    this.toggleUnderline = this.toggleUnderline.bind(this)
    this.handlePassageChange = this.handlePassageChange.bind(this)
  }

  componentWillUnmount() {
    const { returnToView } = this.props;
    returnToView();
  }

  submit() {
    const { title, description, flag, passage, underlineErrorsInProofreader, readingLevel } = this.state
    const formattedPassage = passage.replace(/\n/g, '<br/>')

    this.props.submit({
      title,
      description,
      flag,
      passage: formattedPassage,
      underlineErrorsInProofreader,
      readingLevel
    });
  }

  handleStateChange(key: string, event: React.ChangeEvent<{value: string}>) {
    const changes: LessonFormState | object = {};
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

  handlePassageChange(e) {
    this.setState({ passage: e.target.value, });
  }
  //
  render() {
    const { currentValues, returnToView } = this.props;
    const addOrEdit = currentValues ? 'Edit' : 'Add';
    const buttonText = currentValues ? 'Return To Activity' : 'Return To Activities';
    return (
      <div className="box">
        <div className="button-container">
          <button className="quill-button fun primary contained" onClick={returnToView}>{buttonText}</button>
        </div>
        <h4 className="title">{addOrEdit} Activity</h4>
        <p className="control">
          <label className="label">Name</label>
          <input
            className="input"
            onChange={this.handleStateChange.bind(null, 'title')}
            placeholder="Text input"
            type="text"
            value={this.state.title}
          />
        </p>
        <p className="control">
          <label className="label">Reading Level</label>
          <input
            className="input"
            onChange={this.handleStateChange.bind(null, 'readingLevel')}
            placeholder="Text input"
            type="text"
            value={this.state.readingLevel}
          />
        </p>
        <p className="control">
          <label className="label">Description</label>
        </p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.handleDescriptionChange}
          text={this.state.description || ''}
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
            checked={this.state.underlineErrorsInProofreader}
            name="showUnderlines"
            onChange={this.toggleUnderline}
            type="checkbox"
          />
        </p>
        <EditGenerator />
        <p className="control">
          <label className="label">Passage</label>
          <textarea
            onChange={this.handlePassageChange}
            style={{minHeight: '100px', border: '1px solid black', padding: '10px', width: '100%'}}
            value={this.state.passage}
          />
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
