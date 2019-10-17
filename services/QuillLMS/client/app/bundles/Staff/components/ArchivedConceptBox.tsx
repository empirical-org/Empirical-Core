import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import moment from 'moment'
import _ from 'underscore';
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { Concept } from '../interfaces/interfaces'
import ConceptChangeLogs from './ConceptChangeLogs'
import ChangeLogModal from './ChangeLogModal'


function levelTwoConceptsQuery(){
  return `
  {
    concepts(levelTwoOnly: true) {
      value: id
      label: name
      updatedAt: updatedAt
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
      updatedAt: updatedAt
      visible: visible
      parent {
        value: id
        label: name
        updatedAt: updatedAt
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

interface ArchivedConceptBoxProps {
  levelNumber: number;
  concept: Concept;
  finishEditingConcept(data:any): void;
  closeConceptBox(event:any): void;
}

interface ArchivedConceptBoxState {
  concept: Concept;
  errors: { level1?: string; level2?: string;};
  showChangeLogModal: boolean;
}

class ArchivedConceptBox extends React.Component<ArchivedConceptBoxProps, ArchivedConceptBoxState> {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      errors: {},
      showChangeLogModal: false
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeChangeLogModal = this.closeChangeLogModal.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.concept, nextProps.concept)) {
      this.setState({ concept: nextProps.concept, })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    const { concept } = this.state
    const newConcept = Object.assign({}, concept, { visible: true })
    this.setState({ showChangeLogModal: true, concept: newConcept })
  }

  closeChangeLogModal() {
    this.setState({ showChangeLogModal: false })
  }

  save(editConcept, changeLogs) {
    const { concept } = this.state
    const { levelNumber } = this.props
    let errors
    if (levelNumber === 1 && !concept.parent.visible) {
      const errors = { level2: 'Add a live concept'}
      this.setState({errors})
    } else if (levelNumber === 0 && !concept.parent.visible) {
      const errors = { level1: 'Add a live concept'}
      this.setState({errors})
    } else if (levelNumber === 0 && !concept.parent.parent.visible) {
      const errors = { level2: 'Add a live concept'}
      this.setState({errors})
    } else {
      editConcept({ variables: {
        id: concept.id,
        name: concept.name,
        parentId: concept.parent.id,
        visible: concept.visible,
        changeLogs
      }})
    }
  }

  changeLevel1(level1Concept) {
    const { value, label, updatedAt, visible, parent } = level1Concept
    const newParent = {
      id: value,
      name: label,
      visible,
      updatedAt,
      parent: {
        id: parent.value,
        name: parent.label,
        visible: parent.visible,
        updatedAt: parent.updatedAt
      }
    }
    const newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  changeLevel2(level2Concept) {
    const { value, label, updatedAt, visible } = level2Concept
    const newParent = {
      id: value,
      name: label,
      updatedAt,
      visible
    }
    const newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  renderArchivedOrLive(concept) {
    if (concept.visible) {
      return (
        <div  className="live-or-archived">
          <div>
            <div className="live" />
            Live
          </div>
        </div>)
    } else {
      return (
        <div  className="live-or-archived">
          <div>
            <div className="archived" />
            Archived
          </div>
          <div className="date">{moment(concept.updatedAt* 1000).format('M/D/YY')}</div>
        </div>)
    }
  }

  renderChangeLogModal(editConcept) {
    if (this.state.showChangeLogModal) {
      const { concept } = this.state
      const originalConcept = this.props.concept
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
        concept={concept}
        changedFields={changedFields}
        levelNumber={this.props.levelNumber}
        cancel={this.closeChangeLogModal}
        save={(changeLogs) => { this.save(editConcept, changeLogs)}}
      />
    }
  }

  renderDropdownInput() {
    const { concept, errors } = this.state
    if (this.props.levelNumber === 0) {
      return <Query
        query={gql(levelOneConceptsQuery())}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts;
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt, parent: c.parent }}).sort((a, b) => a.label.localeCompare(b.label))
          const value = options.find(opt => opt.value === concept.parent.id)
          return <div className="concept-input-container">
            <DropdownInput
              label="Level 1"
              value={value}
              options={options}
              handleChange={this.changeLevel1}
              error={errors.level1}
              isSearchable={true}
            />
            {this.renderArchivedOrLive(value)}
          </div>
        }}
      </Query>
    } else {
      return <Query
        query={gql(levelTwoConceptsQuery())}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts;
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt }}).sort((a, b) => a.label.localeCompare(b.label))
          const value = options.find(opt => opt.value === concept.parent.id)
          return <div className="concept-input-container">
            <DropdownInput
              label="Level 2"
              value={value}
              options={options}
              handleChange={this.changeLevel2}
              error={errors.level2}
              isSearchable={true}
            />
            {this.renderArchivedOrLive(value)}
          </div>
        }}
      </Query>

    }
  }

  renderLevels() {
    const { concept, } = this.state
    if (this.props.levelNumber === 2) {
      return <div>
        <div className="concept-input-container">
          <Input
            label='Level 2'
            value={concept.name}
            type='text'
            disabled={true}
          />
          {this.renderArchivedOrLive(concept)}
        </div>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 1'
            value={concept.name}
            type='text'
            disabled={true}
          />
          {this.renderArchivedOrLive(concept)}
        </div>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    } else if (this.props.levelNumber === 0) {
      return <div>
        <div className="concept-input-container">
          <Input
            disabled={true}
            label='Level 2'
            value={concept.parent.parent.name}
            type='text'
          />
          {this.renderArchivedOrLive(concept.parent.parent)}
        </div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 0'
            value={concept.name}
            type='text'
            disabled={true}
          />
          {this.renderArchivedOrLive(concept)}
        </div>
        <ConceptChangeLogs changeLogs={concept.changeLogs} />
      </div>
    }
  }

  renderSaveButton() {
    const { levelNumber } = this.props
    const { concept } = this.state
    if (levelNumber === 2) {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="quill-button contained primary medium"
      />
    } else if (levelNumber === 1 && concept.parent.visible) {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="quill-button contained primary medium"
      />
    } else if (levelNumber === 0 && concept.parent.visible && concept.parent.parent.visible) {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="quill-button contained primary medium"
      />
    } else {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="quill-button contained disabled primary medium"
      />
    }
  }

  render() {
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={this.props.finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="concept-box archived-concept-box">
            {this.renderChangeLogModal(editConcept)}
            <span className="close-concept-box" onClick={this.props.closeConceptBox}><i className="fas fa-times"/></span>
            <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
              <div className="static">
                <p>Level {this.props.levelNumber}</p>
                <h1>{this.state.concept.name}</h1>
                <p>Replaced With: {this.state.concept.replacement ? this.state.concept.replacement.name : 'N/A'}</p>
                <p>UID: {this.state.concept.uid}</p>
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

export default ArchivedConceptBox
