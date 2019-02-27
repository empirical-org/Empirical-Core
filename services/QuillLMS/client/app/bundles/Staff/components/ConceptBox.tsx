import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import _ from 'lodash'

import { Concept } from '../interfaces/interfaces'
import Input from '../../Teacher/components/shared/input'
import DropdownInput from '../../Teacher/components/shared/dropdown_input'

function levelTwoConceptsQuery(){
  return `
  {
    concepts(levelTwoOnly: true) {
      value: id
      label: name
      visible: visible
    }
  }
`
}

function levelOneConceptsQuery(){
  return `
  {
    concepts(levelOneOnly: true) {
      value: id
      label: name
      visible: visible
      parent {
        value: id
        label: name
        visible: visible
      }
    }
  }
`
}

const EDIT_CONCEPT = gql`
mutation editConcept($id: ID! $name: String, $parentId: ID, $visible: Boolean){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, visible: $visible}){
      concept {
        id
        uid
        name
        description
        parentId
        visible
      }
    }
  }
`;

interface ConceptBoxState {
  concept: Concept,
  originalConcept: Concept
}

interface ConceptBoxProps {
  concept: Concept;
  levelNumber: Number;
  finishEditingConcept(data: any): void;
  closeConceptBox(event): void;
}

class ConceptBox extends React.Component<ConceptBoxProps, ConceptBoxState> {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      originalConcept: props.concept
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.archiveConcept = this.archiveConcept.bind(this)
    this.renameConcept = this.renameConcept.bind(this)
    this.cancelRename = this.cancelRename.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.concept, nextProps.concept)) {
      this.setState({ concept: nextProps.concept, originalConcept: nextProps.concept })
    }
  }

  handleSubmit(e, editConcept) {
    e.preventDefault()
    const { concept } = this.state
    editConcept({ variables: {
      id: concept.id,
      name: concept.name,
      parentId: concept.parent.id,
      visible: concept.visible
    }})
  }

  changeLevel1(level1Concept) {
    const newParent = {
      id: level1Concept.value,
      name: level1Concept.label,
      parent: {
        id: level1Concept.parent.value,
        name: level1Concept.parent.label
      }
    }
    const newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  changeLevel2(level2Concept) {
    const newParent = {
      id: level2Concept.value,
      name: level2Concept.label,
    }
    const newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  archiveConcept() {
    const newConcept = Object.assign({}, this.state.concept, { visible: false })
    this.setState({ concept: newConcept })
  }

  renameConcept(e) {
    const newConcept = Object.assign({}, this.state.concept, { name: e.target.value })
    this.setState({ concept: newConcept })
  }

  cancelRename(e) {
    const { originalConcept, concept } = this.state
    const newConcept = Object.assign({}, concept, { name: originalConcept.name })
    this.setState({ concept: newConcept })
  }

  activateConceptInput() {
    document.getElementById('concept-name').focus()
  }

  renderDropdownInput() {
    const { concept } = this.state
    if (this.props.levelNumber === 0) {
      return <Query
        query={gql(levelOneConceptsQuery())}
      >
        {({ loading, error, data }) => {
          console.log('error', error)
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts.filter(c => c.visible && c.parent.visible).sort((a, b) => a.label.localeCompare(b.label));
          const value = possibleConcepts.find(opt => opt.value === concept.parent.id)
          return <DropdownInput
            label="Level 1"
            value={value}
            options={possibleConcepts}
            handleChange={this.changeLevel1}
          />
        }}
      </Query>
    } else {
      return <Query
        query={gql(levelTwoConceptsQuery())}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts.filter(c => c.visible).sort((a, b) => a.label.localeCompare(b.label));
          const value = possibleConcepts.find(opt => opt.value === concept.parent.id)
          return <DropdownInput
            label="Level 2"
            value={value}
            options={possibleConcepts}
            handleChange={this.changeLevel2}
          />
        }}
      </Query>

    }
  }

  renderRenameAndArchiveSection() {
    return <div className="rename-and-archive">
      <span className="rename" onClick={this.activateConceptInput}>
        <i className="fas fa-edit"></i>
        <span>Rename</span>
      </span>
      <span className="archive" onClick={this.archiveConcept}>
        <i className="fas fa-archive"></i>
        <span>Archive</span>
      </span>
  </div>
  }

  renderLevels() {
    const { concept, } = this.state
    const { levelNumber, } = this.props
    if (levelNumber === 2) {
      return <div>
        <div className="concept-input-container">
          <Input
            label='Level 2'
            value={concept.name}
            type='text'
            id='concept-name'
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
      </div>
    } else if (levelNumber === 1) {
      return <div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 1'
            value={concept.name}
            type='text'
            id='concept-name'
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
      </div>
    } else if (levelNumber === 0) {
      return <div>
        <Input
          disabled={true}
          label='Level 2'
          value={concept.parent.parent.name}
          type='text'
        />
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 0'
            value={concept.name}
            type='text'
            id='concept-name'
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
      </div>
    }
  }

  renderSaveButton() {
    const { concept, originalConcept } = this.state
    if (!_.isEqual(concept, originalConcept)) {
      return <input
        type="submit"
        value="Save"
        className="button contained primary medium"
      />
    }
  }

  render() {
    const { finishEditingConcept, levelNumber, closeConceptBox } = this.props
    const { concept } = this.state
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="concept-box">
            <span className="close-concept-box" onClick={closeConceptBox}><i className="fas fa-times"/></span>
            <form onSubmit={(e) => this.handleSubmit(e, editConcept)} acceptCharset="UTF-8" >
              <div className="static">
                <p>Level {levelNumber}</p>
                <h1>{concept.name}</h1>
                <p>UID: {concept.uid}</p>
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

export default ConceptBox
