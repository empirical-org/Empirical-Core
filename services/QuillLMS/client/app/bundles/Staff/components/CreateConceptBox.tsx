import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";

import { DropdownInput, Input } from '../../Shared/index';
import { Concept } from '../interfaces/interfaces';
import ExplanationField from './ExplanationField';
import RuleDescriptionField from './RuleDescriptionField';
import ChangeLogModal from './shared/changeLogModal';

const CREATE_CONCEPT = gql`
  mutation createConcept($name: String!, $parentId: ID, $description: String, $explanation: String, $changeLogs: [ChangeLogInput!]!){
    createConcept(input: {name: $name, parentId: $parentId, description: $description, explanation: $explanation, changeLogs: $changeLogs}){
      concept {
        id
        uid
        name
        parentId
      }
    }
  }
`;


interface CreateConceptBoxProps {
  levelNumber: number;
  finishEditingOrCreatingConcept(data: any): void;
  concepts: Array<Concept>;
}

interface CreateConceptBoxState {
  concept: { parent: Concept, name: string, description: string, explanation: string }
  level1Concepts: Array<Concept>,
  level2Concepts: Array<Concept>,
  showChangeLogModal: boolean
}

class CreateConceptBox extends React.Component<CreateConceptBoxProps, CreateConceptBoxState> {
  constructor(props){
    super(props)

    const { level2Concepts, level1Concepts } = this.sortConcepts(props)

    this.state = {
      concept: { name: '', parent: {}, description: '', explanation: '' },
      level2Concepts,
      level1Concepts,
      showChangeLogModal: false
    }
  }

  sortConcepts(props):{level2Concepts: Array<Concept>, level1Concepts: Array<Concept>} {
    let level1Concepts:Array<Concept> = []
    let level2Concepts:Array<Concept> = []
    props.concepts.forEach(c => {
      if (c.parent && !c.parent.parent) {
        level1Concepts.push(c)
      } else if (!c.parent) {
        level2Concepts.push(c)
      }
    })
    return { level2Concepts, level1Concepts }
  }

  renameConcept = (e) => {
    const { concept, } = this.state
    const newConcept = Object.assign({}, concept, { name: e.target.value })
    this.setState({ concept: newConcept })
  }

  changeDescription = (description) => {
    const { concept, } = this.state
    if (description !== concept.description) {
      const newConcept = Object.assign({}, concept, { description })
      this.setState({ concept: newConcept })
    }
  }

  changeExplanation = (explanation) => {
    const { concept, } = this.state
    if (explanation !== concept.explanation) {
      const newConcept = Object.assign({}, concept, { explanation })
      this.setState({ concept: newConcept })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ showChangeLogModal: true })
  }

  save = (createConcept, changeLogs) => {
    const { concept } = this.state
    createConcept({ variables: {
      name: concept.name,
      parentId: concept.parent.id,
      description: concept.description.length && concept.description !== '<br/>' ? concept.description : null,
      explanation: concept.explanation.length && concept.explanation !== '<br/>' ? concept.explanation : null,
      changeLogs
    }})
    this.setState({ concept: { name: '', parent: {}, description: '' }})
  }

  closeChangeLogModal = () => {
    this.setState({ showChangeLogModal: false })
  }

  changeLevel1 = (level1Concept) => {
    const { concept, level1Concepts, } = this.state
    const savedLevel1Concept = level1Concepts.find(c => c.id === level1Concept.value)
    const newParent = {
      id: savedLevel1Concept.id,
      name: savedLevel1Concept.name,
      parent: {
        id: savedLevel1Concept.parent.id,
        name: savedLevel1Concept.parent.name
      }
    }
    const newConcept = Object.assign({}, concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  changeLevel2 = (level2Concept) => {
    const newParent = {
      id: level2Concept.value,
      name: level2Concept.label,
    }
    let newConcept
    if (this.props.levelNumber === 1) {
      newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    } else {
      newConcept = Object.assign({}, this.state.concept, { parent: { parent: newParent, } })
    }
    this.setState({ concept: newConcept })
  }

  activateConceptInput() {
    document.getElementById('record-name').focus()
  }

  renderDropdownInput(dropdownLevel) {
    const { concept, level1Concepts, level2Concepts } = this.state
    const { levelNumber} = this.props
    if (dropdownLevel === 1) {
      let possibleConcepts = level1Concepts
      if (concept.parent && concept.parent.parent && concept.parent.parent.id) {
        possibleConcepts = level1Concepts.filter(c => c.parent.id === concept.parent.parent.id)
      }
      const options = possibleConcepts.map(c => {return { label: c.name, value: c.id }}).sort((a, b) => a.label.localeCompare(b.label))
      const value = options.find(opt => opt.value === concept.parent.id)
      return (
        <DropdownInput
          handleChange={this.changeLevel1}
          isSearchable={true}
          label="Level 1"
          options={options}
          value={value}
        />
      )
    } else {
      let possibleConcepts = level2Concepts
      if (levelNumber === 0 && concept.parent.id) {
        possibleConcepts = [concept.parent.parent]
      }
      const options = possibleConcepts.map(c => {return { label: c.name, value: c.id }}).sort((a, b) => a.label.localeCompare(b.label))
      let value
      if (levelNumber === 0 && concept.parent.parent) {
        value = options.find(opt => opt.value === concept.parent.parent.id)
      } else {
        value = options.find(opt => opt.value === concept.parent.id)
      }
      return (
        <DropdownInput
          handleChange={this.changeLevel2}
          isSearchable={true}
          label="Level 2"
          options={options}
          value={value}
        />
      )
    }
  }

  renderLevels() {
    const { concept, } = this.state
    if (this.props.levelNumber === 2) {
      return (
        <div>
          <div className="record-input-container">
            <Input
              handleChange={this.renameConcept}
              label='Level 2'
              type='text'
              value={concept.name}
            />
          </div>
        </div>
      )
    } else if (this.props.levelNumber === 1) {
      return (
        <div>
          {this.renderDropdownInput(2)}
          <div className="record-input-container">
            <Input
              handleChange={this.renameConcept}
              label='Level 1'
              type='text'
              value={concept.name}
            />
          </div>
        </div>
      )
    } else if (this.props.levelNumber === 0) {
      return (
        <div>
          {this.renderDropdownInput(2)}
          {this.renderDropdownInput(1)}
          <div className="record-input-container">
            <Input
              handleChange={this.renameConcept}
              label='Level 0'
              type='text'
              value={concept.name}
            />
          </div>
          <RuleDescriptionField handleChange={this.changeDescription} isNew={true} ruleDescription={concept.ruleDescription} />
          <ExplanationField explanation={concept.explanation} handleChange={this.changeExplanation} isNew={true} />
        </div>
      )
    }
  }

  renderSaveButton() {
    const { levelNumber } = this.props
    const { concept } = this.state
    if (levelNumber === 2 && concept.name) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value={`Add New Level ${this.props.levelNumber}`}
        />
      )
    } else if ((levelNumber === 1 || levelNumber === 0) && concept.parent.id) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value={`Add New Level ${this.props.levelNumber}`}
        />
      )
    }
  }

  renderChangeLogModal(createConcept) {
    if (this.state.showChangeLogModal) {
      const { concept, } = this.state
      return (
        <ChangeLogModal
          cancel={this.closeChangeLogModal}
          changedFields={[{ fieldName: 'new' }]}
          levelNumber={this.props.levelNumber}
          record={concept}
          save={(changeLogs) => { this.save(createConcept, changeLogs)}}
        />
      )
    }
  }

  render() {
    const { levelNumber, } = this.props
    return  (
      <Mutation mutation={CREATE_CONCEPT} onCompleted={this.props.finishEditingOrCreatingConcept}>
        {(createConcept, {}) => (
          <div className={`record-box create-record-box create-record-box-level-${levelNumber}`}>
            {this.renderChangeLogModal(createConcept)}
            <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
              <div className="static">
                <h1>Create a Level {levelNumber}</h1>
              </div>
              <div className="fields">
                {this.renderLevels()}
                {this.renderSaveButton()}
              </div>
            </form>
          </div>
        )}
      </Mutation>
    )
  }

};

export default CreateConceptBox
