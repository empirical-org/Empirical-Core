import gql from "graphql-tag";
import _ from 'lodash';
import moment from 'moment';
import * as React from "react";
import { Mutation, Query } from "react-apollo";

import { DropdownInput, Input } from '../../Shared/index';
import { Concept } from '../interfaces/interfaces';
import ExplanationField from './ExplanationField';
import RuleDescriptionField from './RuleDescriptionField';
import ChangeLogModal from './shared/changeLogModal';
import IndividualRecordChangeLogs from './shared/individualRecordChangeLogs';

const formatDateTime = (cl) => moment.unix(cl.createdAt).format('MMMM D, YYYY [at] LT')

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
mutation editConcept($id: ID! $name: String, $parentId: ID, $visible: Boolean, $description: String, $explanation: String, $changeLogs: [ChangeLogInput!]!){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, visible: $visible, description: $description, explanation: $explanation, changeLogs: $changeLogs}){
      concept {
        id
        uid
        name
        description
        explanation
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.concept, nextProps.concept)) {
      this.setState({ concept: nextProps.concept, originalConcept: nextProps.concept })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ showChangeLogModal: true })
  }

  closeChangeLogModal = () => {
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
      return (
        <ChangeLogModal
          cancel={this.closeChangeLogModal}
          changedFields={changedFields}
          levelNumber={this.props.levelNumber}
          record={concept}
          save={(changeLogs) => { this.save(editConcept, changeLogs)}}
        />
      )
    }
  }

  save = (editConcept, changeLogs) => {
    const { concept } = this.state
    editConcept({ variables: {
      id: concept.id,
      name: concept.name,
      parentId: concept.parent.id,
      visible: concept.visible,
      description: concept.description && concept.description.length && concept.description !== '<br/>' ? concept.description : null,
      explanation: concept.explanation && concept.explanation.length && concept.explanation !== '<br/>' ? concept.explanation : null,
      changeLogs
    }})
  }

  changeLevel1 = (level1Concept) => {
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

  changeLevel2 = (level2Concept) => {
    const newParent = {
      id: level2Concept.value,
      name: level2Concept.label,
    }
    const newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  toggleVisiblity = () => {
    const { concept, } = this.state
    const newConcept = Object.assign({}, concept, { visible: !concept.visible })
    this.setState({ concept: newConcept })
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

  cancelRename = (e) => {
    const { originalConcept, concept } = this.state
    const newConcept = Object.assign({}, concept, { name: originalConcept.name })
    this.setState({ concept: newConcept })
  }

  activateConceptInput = () => {
    document.getElementById('record-name').focus()
  }

  renderDropdownInput = () => {
    const { concept } = this.state
    if (this.props.levelNumber === 0) {
      return (
        <Query
          query={gql(levelOneConceptsQuery())}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const possibleConcepts = data.concepts.filter(c => c.visible && c.parent.visible).sort((a, b) => a.label.localeCompare(b.label));
            const value = possibleConcepts.find(opt => opt.value === concept.parent.id)
            return (
              <DropdownInput
                handleChange={this.changeLevel1}
                isSearchable={true}
                label="Level 1"
                options={possibleConcepts}
                value={value}
              />
            )
          }}
        </Query>
      )
    } else {
      return (
        <Query
          query={gql(levelTwoConceptsQuery())}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const possibleConcepts = data.concepts.filter(c => c.visible).sort((a, b) => a.label.localeCompare(b.label));
            const value = possibleConcepts.find(opt => opt.value === concept.parent.id)
            return (
              <DropdownInput
                handleChange={this.changeLevel2}
                isSearchable={true}
                label="Level 2"
                options={possibleConcepts}
                value={value}
              />
            )
          }}
        </Query>
      )

    }
  }

  renderRenameAndArchiveSection = () => {
    const { concept, } = this.state
    return (
      <div className="rename-and-archive">
        <span className="rename" onClick={this.activateConceptInput}>
          <i className="fas fa-edit" />
          <span>Rename</span>
        </span>
        <span className="archive" onClick={this.toggleVisiblity}>
          <i className="fas fa-archive" />
          <span>{ concept.visible ? 'Archive' : 'Unarchive' }</span>
        </span>
      </div>
    )
  }

  renderLevels = () => {
    const { concept, } = this.state
    const { levelNumber, } = this.props
    if (levelNumber === 2) {
      return (
        <div>
          <div className="record-input-container">
            <Input
              handleCancel={this.cancelRename}
              handleChange={this.renameConcept}
              id='record-name'
              label='Level 2'
              type='text'
              value={concept.name}
            />
            {this.renderRenameAndArchiveSection()}
          </div>
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    } else if (levelNumber === 1) {
      return (
        <div>
          {this.renderDropdownInput()}
          <div className="record-input-container">
            <Input
              handleCancel={this.cancelRename}
              handleChange={this.renameConcept}
              id='record-name'
              label='Level 1'
              type='text'
              value={concept.name}
            />
            {this.renderRenameAndArchiveSection()}
          </div>
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    } else if (levelNumber === 0) {
      return (
        <div>
          <Input
            disabled={true}
            label='Level 2'
            type='text'
            value={concept.parent.parent.name}
          />
          {this.renderDropdownInput()}
          <div className="record-input-container">
            <Input
              handleCancel={this.cancelRename}
              handleChange={this.renameConcept}
              id='record-name'
              label='Level 0'
              type='text'
              value={concept.name}
            />
            {this.renderRenameAndArchiveSection()}
          </div>
          <RuleDescriptionField handleChange={this.changeDescription} ruleDescription={concept.description} />
          <ExplanationField explanation={concept.explanation} handleChange={this.changeExplanation} />
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    }
  }

  renderSaveButton = () => {
    const { concept, originalConcept } = this.state
    if (!_.isEqual(concept, originalConcept)) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Save"
        />
      )
    }
  }

  render() {
    const { levelNumber, closeConceptBox, finishEditingConcept } = this.props
    const { concept } = this.state
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="record-box">
            {this.renderChangeLogModal(editConcept)}
            <span className="close-record-box" onClick={closeConceptBox}><i className="fas fa-times" /></span>
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
