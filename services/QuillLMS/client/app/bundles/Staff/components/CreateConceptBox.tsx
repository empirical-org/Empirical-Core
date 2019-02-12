import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import _ from 'lodash'

import Input from '../../Teacher/components/shared/input'
import DropdownInput from '../../Teacher/components/shared/dropdown_input'

function levelTwoConceptsQuery(){
  return `
  {
    concepts(levelTwoOnly: true) {
      value: id
      label: name
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
      parent {
        value: id
        label: name
      }
    }
  }
`
}

const CREATE_CONCEPT = gql`
  mutation createConcept($name: String!, $parentId: ID, $description: String){
    createConcept(input: {name: $name, parentId: $parentId, description: $description}){
      concept {
        id
        uid
        name
        parentId
      }
    }
  }
`;

export interface Concept {
  id:string;
  name:string;
  parent?:Concept;
}

interface CreateConceptBoxProps {
  levelNumber: Number;
  finishEditingOrCreatingConcept: Function;
}

interface CreateConceptBoxState {
  concept: { parent: Concept|{}, name: string }
}

class CreateConceptBox extends React.Component<CreateConceptBoxProps, CreateConceptBoxState> {
  constructor(props){
    super(props)

    this.state = {
      concept: { name: '', parent: {}},
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.renameConcept = this.renameConcept.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  renameConcept(e) {
    const newConcept = Object.assign({}, this.state.concept, { name: e.target.value })
    this.setState({ concept: newConcept })
  }

  handleSubmit(e, createConcept) {
    e.preventDefault()
    const { concept } = this.state
    createConcept({ variables: {
      name: concept.name,
      parentId: concept.parent.id
    }})
    this.setState({ concept: { name: '', parent: {}}})
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
          const possibleConcepts:CascaderOptionType[] = data.concepts;
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value }})
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
          const possibleConcepts:CascaderOptionType[] = data.concepts;
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value }})
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

  renderLevels() {
    const { concept, } = this.state
    if (this.props.levelNumber === 2) {
      return <div>
        <div className="concept-input-container">
          <Input
            label='Level 2'
            value={concept.name}
            type='text'
            id='concept-name'
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 1'
            value={concept.name}
            type='text'
            id='concept-name'
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    } else if (this.props.levelNumber === 0) {
      return <div>
        <Input
          disabled={true}
          label='Level 2'
          value={concept.parent && concept.parent.parent ? concept.parent.parent.name : ''}
          type='text'
        />
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 0'
            value={concept.name}
            type='text'
            id='concept-name'
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    }
  }

  renderSaveButton() {
    const { concept } = this.state
    if (concept.name) {
      return <input
        type="submit"
        value={`Add New Level ${this.props.levelNumber}`}
        className="button contained primary medium"
      />
    }
  }

  render() {
    const { levelNumber, } = this.props
    return  (
      <Mutation mutation={CREATE_CONCEPT} onCompleted={this.props.finishEditingOrCreatingConcept}>
        {(createConcept, {}) => (
          <div className={`concept-box create-concept-box create-concept-box-level-${levelNumber}`}>
            <form onSubmit={(e) => this.handleSubmit(e, createConcept)} acceptCharset="UTF-8" >
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
