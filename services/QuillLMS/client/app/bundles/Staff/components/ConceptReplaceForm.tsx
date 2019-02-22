import * as React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Concept } from '../interfaces/interfaces'

import DropdownInput from '../../Teacher/components/shared/dropdown_input'

const REPLACE_CONCEPT = gql`
  mutation replaceConcept($id: ID! $replacementId: ID!){
    replaceConcept(input: {id: $id, replacementId: $replacementId}){
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
  replacementId: string|null
}

class ConceptReplaceForm extends React.Component<ConceptReplaceFormProps, any> {
  constructor(props){
    super(props)
    this.state = {
      replacedId: null,
      replacementId: null
    };

    this.changeReplacedId = this.changeReplacedId.bind(this)
    this.changeReplacementId = this.changeReplacementId.bind(this)
  }

  handleSubmit(e, replaceConcept) {
    e.preventDefault()
    const { replacedId, replacementId} = this.state
    replaceConcept({ variables: {
      id: replacedId,
      replacementId
    }})
    this.setState({ replacedId: null, replacementId: null })
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
        className="button contained  primary medium"
      />
    }
  }

  renderDropdownInput(replacedOrReplacement) {
    const { replacementId, replacedId} = this.state
    const { concepts } = this.props
    const options = concepts.map(c => { return { label: `${c.parent.parent.name} | ${c.parent.name} | ${c.name}`, value: c.id }})
    if (replacedOrReplacement === 'replaced') {
      const value = options.find(o => o.value === replacedId)
      return <DropdownInput
        label="Concept"
        value={value}
        options={options}
        handleChange={this.changeReplacedId}
      />
    } else {
      const value = options.find(o => o.value === replacementId)
      return <DropdownInput
        label="Concept"
        value={value}
        options={options}
        handleChange={this.changeReplacementId}
      />
    }
  }

  render() {
    return (
      <Mutation mutation={REPLACE_CONCEPT}  onCompleted={this.props.showSuccessBanner}>
        {(replaceConcept, {}) => (
          <div className="find-and-replace">
            <div className="find-and-replace-section">
              <div className="find-and-replace-section-header">
                <div className="section-number">1</div>
                <a href="/cms/concepts/concepts_in_use.csv">View Concepts in use</a>
              </div>
            </div>
            <form onSubmit={(e) => this.handleSubmit(e, replaceConcept)} acceptCharset="UTF-8" >
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
