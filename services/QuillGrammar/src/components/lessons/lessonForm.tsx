import * as React from 'react';
import { connect } from 'react-redux';
import { EditorState, ContentState } from 'draft-js'
import TextEditor from '../shared/textEditor'
import ConceptSelector from '../shared/conceptSelector'
import { GrammarActivity, Concepts, Concept } from '../../interfaces/grammarActivities'
import { ConceptReducerState } from '../../reducers/conceptsReducer'

interface LessonFormState {
  title: string;
  description: string;
  flag: string;
  concepts: Concepts;
}

interface LessonFormProps {
  submit: Function;
  concepts: ConceptReducerState;
  stateSpecificClass?: string;
  currentValues: LessonFormState|null;
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
      concepts: currentValues ? currentValues.concepts : {}
    }

    this.submit = this.submit.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFlagSelect = this.handleFlagSelect.bind(this)
    this.addConcept = this.addConcept.bind(this)
    this.renderConceptRows = this.renderConceptRows.bind(this)
    this.removeConcept = this.removeConcept.bind(this)
    this.changeConceptQuantity = this.changeConceptQuantity.bind(this)
  }

  submit() {
    const { title, concepts, description, flag, } = this.state
    this.props.submit({
      title,
      concepts,
      description,
      flag
    });
  }

  handleStateChange(key: string, event: React.ChangeEvent<{value: string}>) {
    const changes: LessonFormState = {};
    changes[key] = event.target.value;
    this.setState(changes);
  }

  addConcept(concept: { value: string }) {
    const { value } = concept
    if (value) {
      const currentSelectedConcepts = this.state.concepts;
      let newSelectedConcepts = currentSelectedConcepts;
      newSelectedConcepts[value] = { quantity: 0 }
      this.setState({ concepts: newSelectedConcepts, });
    }
  }

  changeConceptQuantity(conceptUid: string, e: React.ChangeEvent<{value: string}>) {
    const number = e.target.value ? parseInt(e.target.value) : 0
    const newSelectedConcepts = this.state.concepts;
    newSelectedConcepts[conceptUid] = { quantity: number }
    this.setState({ concepts: newSelectedConcepts, });
  }

  removeConcept(conceptUid: string) {
    let newSelectedConcepts = this.state.concepts;
    delete newSelectedConcepts[conceptUid]
    this.setState({ concepts: newSelectedConcepts, });
  }

  handleFlagSelect(e: React.ChangeEvent<{value: string}>) {
    this.setState({ flag: e.target.value, });
  }

  handleDescriptionChange(e: string) {
    this.setState({ description: e, });
  }

  renderConceptRows(): Array<JSX.Element|undefined>|void {
    const conceptUids = Object.keys(this.state.concepts)
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
                  onChange={(e) => this.changeConceptQuantity(c, e)}>
                </input>
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
          <label className="label">Concept Selector</label>
          <ConceptSelector handleSelectorChange={this.addConcept}/>
        </p>
        {this.renderConceptRows()}
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
