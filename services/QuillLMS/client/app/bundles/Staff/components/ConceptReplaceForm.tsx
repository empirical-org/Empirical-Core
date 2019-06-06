import * as React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { Concept } from '../interfaces/interfaces'
import ChangeLogModal from './ChangeLogModal'

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
    if (showChangeLogModal) {
      const changedFields = ['replaced']
      return <ChangeLogModal
        concept={this.props.concepts.find(c => c.id === replacedId)}
        levelNumber={0}
        changedFields={changedFields}
        cancel={this.closeChangeLogModal}
        save={(changeLogs) => { this.save(replaceConcept, changeLogs)}}
      />
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
      return <input
        type="submit"
        value="Replace"
        className="quill-button contained primary medium"
      />
    }
  }

  renderDropdownInput(replacedOrReplacement) {
    const { replacementId, replacedId} = this.state
    const { concepts } = this.props
    const options = concepts.map(c => { return { label: `${c.parent.parent.name} | ${c.parent.name} | ${c.name}`, value: c.id }}).sort((a, b) => a.label.localeCompare(b.label))
    if (replacedOrReplacement === 'replaced') {
      const value = options.find(o => o.value === replacedId)
      return <DropdownInput
        label="Concept"
        value={value}
        options={options}
        handleChange={this.changeReplacedId}
        isSearchable={true}
      />
    } else {
      const value = options.find(o => o.value === replacementId)
      return <DropdownInput
        label="Concept"
        value={value}
        options={options}
        handleChange={this.changeReplacementId}
        isSearchable={true}
      />
    }
  }

  render() {
    return (
      <Mutation mutation={REPLACE_CONCEPT}  onCompleted={this.props.showSuccessBanner}>
        {(replaceConcept, {}) => (
          <div className="find-and-replace">
          {this.renderChangeLogModal(replaceConcept)}
            <div className="find-and-replace-section">
              <div className="find-and-replace-section-header">
                <div className="section-number">1</div>
                <a href="/cms/concepts/concepts_in_use.csv">View Concepts in use</a>
              </div>
            </div>
            <form className="find-and-replace-form" onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
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
