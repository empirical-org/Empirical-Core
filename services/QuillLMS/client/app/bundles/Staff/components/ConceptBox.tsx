import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import _ from 'lodash'
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { Concept } from '../interfaces/interfaces'
import RuleDescriptionField from './RuleDescriptionField'
import ConceptChangeLogs from './ConceptChangeLogs'
import ChangeLogModal from './ChangeLogModal'

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
mutation editConcept($id: ID! $name: String, $parentId: ID, $visible: Boolean, $description: String, $changeLogs: [ChangeLogInput!]!){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, visible: $visible, description: $description, changeLogs: $changeLogs}){
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
  originalConcept: Concept,
  showChangeLogModal: boolean
}

interface ConceptBoxProps {
  concept: Concept;
  levelNumber: number;
  finishEditingConcept(data: any): void;
  closeConceptBox(event): void;
}

class ConceptBox extends React.Component<ConceptBoxProps, ConceptBoxState> {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      originalConcept: props.concept,
      showChangeLogModal: false
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.toggleVisiblity = this.toggleVisiblity.bind(this)
    this.renameConcept = this.renameConcept.bind(this)
    this.cancelRename = this.cancelRename.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.changeDescription = this.changeDescription.bind(this)
    this.closeChangeLogModal = this.closeChangeLogModal.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.concept, nextProps.concept)) {
      this.setState({ concept: nextProps.concept, originalConcept: nextProps.concept })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({ showChangeLogModal: true })
  }

  closeChangeLogModal() {
    this.setState({ showChangeLogModal: false })
  }

  renderChangeLogModal(editConcept) {
    if (this.state.showChangeLogModal) {
      const { concept, originalConcept } = this.state
      const changedFields = []
      Object.keys(concept).forEach(key => {
        if (concept[key] !== originalConcept[key]) {
          let changedField = { fieldName: key, previousValue: originalConcept[key], newValue: concept[key]}
          if (key === 'parent') {
            changedField = {
              fieldName: 'parent_id',
              previousValue: originalConcept[key].id,
              newValue: originalConcept[key].id
            }
          }
          changedFields.push(changedField)
        }
      })
      return <ChangeLogModal
        cancel={this.closeChangeLogModal}
        changedFields={changedFields}
        concept={concept}
        levelNumber={this.props.levelNumber}
        save={(changeLogs) => { this.save(editConcept, changeLogs)}}
      />
    }
  }

  save(editConcept, changeLogs) {
    const { concept } = this.state
    editConcept({ variables: {
      id: concept.id,
      name: concept.name,
      parentId: concept.parent.id,
      visible: concept.visible,
      description: concept.description && concept.description.length && concept.description !== '<br/>' ? concept.description : null,
      changeLogs
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

  toggleVisiblity() {
    const { concept, } = this.state
    const newConcept = Object.assign({}, this.state.concept, { visible: !concept.visible })
    this.setState({ concept: newConcept })
  }

  renameConcept(e) {
    const newConcept = Object.assign({}, this.state.concept, { name: e.target.value })
    this.setState({ concept: newConcept })
  }

  changeDescription(description) {
    if (description !== this.state.concept.description) {
      const newConcept = Object.assign({}, this.state.concept, { description })
      this.setState({ concept: newConcept })
    }
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
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts.filter(c => c.visible && c.parent.visible).sort((a, b) => a.label.localeCompare(b.label));
          const value = possibleConcepts.find(opt => opt.value === concept.parent.id)
          return <DropdownInput
            handleChange={this.changeLevel1}
            isSearchable={true}
            label="Level 1"
            options={possibleConcepts}
            value={value}
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
            handleChange={this.changeLevel2}
            isSearchable={true}
            label="Level 2"
            options={possibleConcepts}
            value={value}
          />
        }}
      </Query>

    }
  }

  renderRenameAndArchiveSection() {
    const { concept, } = this.state
    return <div className="rename-and-archive">
      <span className="rename" onClick={this.activateConceptInput}>
        <i className="fas fa-edit" />
        <span>Rename</span>
      </span>
      <span className="archive" onClick={this.toggleVisiblity}>
        <i className="fas fa-archive" />
        <span>{ concept.visible ? 'Archive' : 'Unarchive' }</span>
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
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
            id='concept-name'
            label='Level 2'
            type='text'
            value={concept.name}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    } else if (levelNumber === 1) {
      return <div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
            id='concept-name'
            label='Level 1'
            type='text'
            value={concept.name}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    } else if (levelNumber === 0) {
      return <div>
        <Input
          disabled={true}
          label='Level 2'
          type='text'
          value={concept.parent.parent.name}
        />
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            handleCancel={this.cancelRename}
            handleChange={this.renameConcept}
            id='concept-name'
            label='Level 0'
            type='text'
            value={concept.name}
          />
          {this.renderRenameAndArchiveSection()}
        </div>
        <RuleDescriptionField handleChange={this.changeDescription} ruleDescription={concept.description}/>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    }
  }

  renderSaveButton() {
    const { concept, originalConcept } = this.state
    if (!_.isEqual(concept, originalConcept)) {
      return <input
        className="quill-button contained primary medium"
        type="submit"
        value="Save"
      />
    }
  }

  render() {
    const { levelNumber, closeConceptBox, finishEditingConcept } = this.props
    const { concept } = this.state
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="concept-box">
            {this.renderChangeLogModal(editConcept)}
            <span className="close-concept-box" onClick={closeConceptBox}><i className="fas fa-times"/></span>
            <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
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
