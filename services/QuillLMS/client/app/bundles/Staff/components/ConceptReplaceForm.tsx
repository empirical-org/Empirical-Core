import * as React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { DropdownInput } from '../../Shared/index'

import { Concept } from '../interfaces/interfaces'
import ChangeLogModal from './shared/changeLogModal'

const REPLACE_CONCEPT = gql`
  mutation replaceConcept($id: ID! $replacementId: ID!, $changeLogs: [ChangeLogInput!]!){
    replaceConcept(input: {id: $id, replacementId: $replacementId, changeLogs: $changeLogs}){
      concept {
        id
        uid
        name
        parentId
        visible
      }
    }
  }
`;


interface ConceptReplaceFormProps {
  concepts: Array<Concept>,
  showSuccessBanner(data: any): void
}

interface ConceptReplaceFormState {
  replacedId: string|null,
  replacementId: string|null,
  showChangeLogModal: boolean
}

class ConceptReplaceForm extends React.Component<ConceptReplaceFormProps, ConceptReplaceFormState> {
  constructor(props) {
    super(props)
    this.state = {
      replacedId: null,
      replacementId: null,
      showChangeLogModal: false
    };

    this.changeReplacedId = this.changeReplacedId.bind(this)
    this.changeReplacementId = this.changeReplacementId.bind(this)
    this.closeChangeLogModal = this.closeChangeLogModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({ showChangeLogModal: true })
  }

  closeChangeLogModal() {
    this.setState({ showChangeLogModal: false })
  }

  renderChangeLogModal(replaceConcept) {
    const { showChangeLogModal, replacedId, } = this.state
    const replacedConcept = this.props.concepts.find(c => c.id === replacedId)
    if (showChangeLogModal) {
      const changedFields = [ { fieldName: 'replaced' } ]
      return (
        <ChangeLogModal
          cancel={this.closeChangeLogModal}
          changedFields={changedFields}
          levelNumber={0}
          record={replacedConcept}
          save={(changeLogs) => { this.save(replaceConcept, changeLogs)}}
        />
      )
    }
  }

  save(replaceConcept, changeLogs) {
    const { replacedId, replacementId} = this.state
    replaceConcept({ variables: {
      id: replacedId,
      replacementId,
      changeLogs
    }})
    this.setState({ replacedId: null, replacementId: null, showChangeLogModal: false, })
  }

  changeReplacedId(e) {
    this.setState({replacedId: e.value})
  }

  changeReplacementId(e) {
    this.setState({replacementId: e.value})
  }

  renderSaveButton() {
    const { replacementId, replacedId } = this.state
    if (replacementId && replacedId) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Replace"
        />
      )
    }
  }

  renderDropdownInput(replacedOrReplacement) {
    const { replacementId, replacedId} = this.state
    const { concepts } = this.props
    const options = concepts.map(c => { return { label: `${c.parent.parent.name} | ${c.parent.name} | ${c.name}`, value: c.id }}).sort((a, b) => a.label.localeCompare(b.label))
    if (replacedOrReplacement === 'replaced') {
      const value = options.find(o => o.value === replacedId)
      return (
        <DropdownInput
          handleChange={this.changeReplacedId}
          isSearchable={true}
          label="Concept"
          options={options}
          value={value}
        />
      )
    } else {
      const value = options.find(o => o.value === replacementId)
      return (
        <DropdownInput
          handleChange={this.changeReplacementId}
          isSearchable={true}
          label="Concept"
          options={options}
          value={value}
        />
      )
    }
  }

  handleConceptsInUseAlert = () => {
    alert("This feature no longer works. Please contact the current Support Dev to get Concepts in Use info for particular concept(s).")
  }

  render() {
    return (
      <Mutation mutation={REPLACE_CONCEPT} onCompleted={this.props.showSuccessBanner}>
        {(replaceConcept, {}) => (
          <div className="find-and-replace">
            {this.renderChangeLogModal(replaceConcept)}
            <div className="find-and-replace-section">
              <div className="find-and-replace-section-header">
                <div className="section-number">1</div>
                <a onClick={this.handleConceptsInUseAlert}>View Concepts in use</a>
              </div>
            </div>
            <form acceptCharset="UTF-8" className="find-and-replace-form" onSubmit={this.handleSubmit} >
              <div className="find-and-replace-section">
                <div className="find-and-replace-section-header">
                  <div className="section-number">2</div>
                  <h2>Find this tag</h2>
                </div>
                {this.renderDropdownInput('replaced')}
              </div>
              <div className="find-and-replace-section replace-section">
                <div className="find-and-replace-section-header">
                  <div className="section-number">3</div>
                  <h2>Replace with this tag</h2>
                </div>
                {this.renderDropdownInput('replacement')}
              </div>
              {this.renderSaveButton()}
            </form>
          </div>
        )}
      </Mutation>
    )
  }
};

export default ConceptReplaceForm
