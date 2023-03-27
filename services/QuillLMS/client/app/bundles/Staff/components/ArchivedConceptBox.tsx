import gql from "graphql-tag";
import moment from 'moment';
import * as React from "react";
import { Mutation, Query } from "react-apollo";
import _ from 'underscore';

import { DropdownInput, Input } from '../../Shared/index';
import { Concept } from '../interfaces/interfaces';
import ChangeLogModal from './shared/changeLogModal';
import IndividualRecordChangeLogs from './shared/individualRecordChangeLogs';

const formatDateTime = (cl) => moment.unix(cl.createdAt).format('MMMM D, YYYY [at] LT')

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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
        <div className="live-or-archived">
          <div>
            <div className="live" />
            Live
          </div>
        </div>
      )
    } else {
      return (
        <div className="live-or-archived">
          <div>
            <div className="archived" />
            Archived
          </div>
          <div className="date">{moment(concept.updatedAt* 1000).format('M/D/YY')}</div>
        </div>
      )
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

  renderDropdownInput() {
    const { concept, errors } = this.state
    if (this.props.levelNumber === 0) {
      return (
        <Query
          query={gql(levelOneConceptsQuery())}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const possibleConcepts = data.concepts;
            const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt, parent: c.parent }}).sort((a, b) => a.label.localeCompare(b.label))
            const value = options.find(opt => opt.value === concept.parent.id)
            return (
              <div className="record-input-container">
                <DropdownInput
                  error={errors.level1}
                  handleChange={this.changeLevel1}
                  isSearchable={true}
                  label="Level 1"
                  options={options}
                  value={value}
                />
                {this.renderArchivedOrLive(value)}
              </div>
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
            const possibleConcepts = data.concepts;
            const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt }}).sort((a, b) => a.label.localeCompare(b.label))
            const value = options.find(opt => opt.value === concept.parent.id)
            return (
              <div className="record-input-container">
                <DropdownInput
                  error={errors.level2}
                  handleChange={this.changeLevel2}
                  isSearchable={true}
                  label="Level 2"
                  options={options}
                  value={value}
                />
                {this.renderArchivedOrLive(value)}
              </div>
            )
          }}
        </Query>
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
              disabled={true}
              label='Level 2'
              type='text'
              value={concept.name}
            />
            {this.renderArchivedOrLive(concept)}
          </div>
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    } else if (this.props.levelNumber === 1) {
      return (
        <div>
          {this.renderDropdownInput()}
          <div className="record-input-container">
            <Input
              disabled={true}
              label='Level 1'
              type='text'
              value={concept.name}
            />
            {this.renderArchivedOrLive(concept)}
          </div>
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    } else if (this.props.levelNumber === 0) {
      return (
        <div>
          <div className="record-input-container">
            <Input
              disabled={true}
              label='Level 2'
              type='text'
              value={concept.parent.parent.name}
            />
            {this.renderArchivedOrLive(concept.parent.parent)}
          </div>
          {this.renderDropdownInput()}
          <div className="record-input-container">
            <Input
              disabled={true}
              label='Level 0'
              type='text'
              value={concept.name}
            />
            {this.renderArchivedOrLive(concept)}
          </div>
          <IndividualRecordChangeLogs changeLogs={concept.changeLogs} formatDateTime={formatDateTime} />
        </div>
      )
    }
  }

  renderSaveButton() {
    const { levelNumber } = this.props
    const { concept } = this.state
    if (levelNumber === 2) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    } else if (levelNumber === 1 && concept.parent.visible) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    } else if (levelNumber === 0 && concept.parent.visible && concept.parent.parent.visible) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    } else {
      return (
        <input
          className="quill-button contained disabled primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    }
  }

  render() {
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={this.props.finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="record-box archived-record-box">
            {this.renderChangeLogModal(editConcept)}
            <span className="close-record-box" onClick={this.props.closeConceptBox}><i className="fas fa-times" /></span>
            <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
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
