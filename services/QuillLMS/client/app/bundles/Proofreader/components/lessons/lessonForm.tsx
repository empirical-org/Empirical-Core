import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';
import { connect } from 'react-redux';

import EditGenerator from './editGenerator';

import { TextEditor } from '../../../Shared/index';
import { ConceptReducerState } from '../../reducers/conceptsReducer';

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
  returnToView: (e) => void;
}

export class LessonForm extends React.Component<LessonFormProps, LessonFormState> {

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
  }

  handleSubmit = () => {
    const { submit } = this.props
    const { title, description, flag, passage, underlineErrorsInProofreader, readingLevel } = this.state
    const formattedPassage = passage.replace(/\n/g, '<br/>')
    submit({
      title,
      description,
      flag,
      passage: formattedPassage,
      underlineErrorsInProofreader,
      readingLevel
    });
  }

  handleTitleChange = (e: React.ChangeEvent<{value: string}>) => {
    this.setState({ title: e.target.value, });
  }

  handleReadingLevelChange = (e: React.ChangeEvent<{value: string}>) => {
    this.setState({ readingLevel: e.target.value, });
  }

  handleFlagSelect = (e: React.ChangeEvent<{value: string}>) => {
    this.setState({ flag: e.target.value, });
  }

  handleToggleUnderline = () => {
    const { underlineErrorsInProofreader } = this.state;
    this.setState({ underlineErrorsInProofreader: !underlineErrorsInProofreader });
  }

  onHandleDescriptionChange = (e: string) => {
    this.setState({ description: e, });
  }

  handlePassageChange = (e: React.ChangeEvent<{value: string}>) => {
    this.setState({ passage: e.target.value, });
  }

  render() {
    const { currentValues, returnToView, stateSpecificClass } = this.props;
    const { title, readingLevel, description, flag, underlineErrorsInProofreader, passage } = this.state;
    const addOrEdit = currentValues ? 'Edit' : 'Add';
    const buttonText = currentValues ? 'Return To Activity' : 'Return To Activities';
    return (
      <div className="box">
        <div className="button-container">
          <button className="quill-button fun primary contained" onClick={returnToView} type="button">{buttonText}</button>
        </div>
        <h4 className="title">{addOrEdit} Activity</h4>
        <p className="control">
          <label className="label" htmlFor="title-input" id="title-label">Name</label>
          <input
            aria-labelledby="title-label"
            className="input"
            id="title-input"
            onChange={this.handleTitleChange}
            placeholder="Text input"
            type="text"
            value={title}
          />
        </p>
        <p className="control">
          <label className="label" htmlFor="reading-level-input" id="reading-level-label">Reading Level</label>
          <input
            aria-labelledby="reading-level-label"
            className="input"
            id="reading-level-input"
            onChange={this.handleReadingLevelChange}
            placeholder="Text input"
            type="text"
            value={readingLevel}
          />
        </p>
        <p className="control">
          <label className="label" htmlFor="description" id="description-label" >Description</label>
        </p>
        <TextEditor
          aria-labelledby="description-label"
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.onHandleDescriptionChange}
          id="description"
          text={description || ''}
        />
        <br />
        <p className="control">
          <label className="label" htmlFor="flag-dropdown" id="flag-dropdown-label">Flag</label>
          <span className="select">
            <select aria-labelledby="flag-dropdown-label" defaultValue={flag} id="flag-dropdown" onChange={this.handleFlagSelect}>
              <option value="alpha">alpha</option>
              <option value="beta">beta</option>
              <option value="gamma">gamma</option>
              <option value="production">production</option>
              <option value="archived">archived</option>
            </select>
          </span>
        </p>
        <p className="control">
          <label className="label" htmlFor="underlines-input" id="underlines-label" >Show Underlines</label>
          <input
            aria-labelledby="underlines-label"
            checked={underlineErrorsInProofreader}
            id="underlines-input"
            name="showUnderlines"
            onChange={this.handleToggleUnderline}
            type="checkbox"
          />
        </p>
        <EditGenerator />
        <p className="control">
          <label className="label" htmlFor="passage" id="passage-label">Passage</label>
          <textarea
            aria-labelledby="passage-label"
            id="passage"
            onChange={this.handlePassageChange}
            style={{minHeight: '100px', border: '1px solid black', padding: '10px', width: '100%'}}
            value={passage}
          />
        </p>
        <p className="control">
          <button className={`button is-primary ${stateSpecificClass}`} onClick={this.handleSubmit} type="submit">Submit</button>
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
