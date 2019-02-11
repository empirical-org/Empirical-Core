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

const EDIT_CONCEPT = gql`
mutation editConcept($id: ID! $name: String, $parentId: ID, $description: String){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, description: $description}){
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

export interface Concept {
  id:string;
  name:string;
  parent?:Concept;
}
interface QueryResult {
  id:string;
  name:string;
  parent?:Concept;
  children: Array<Concept>;
  siblings: Array<Concept>;
}

class ConceptBox extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      originalConcept: props.concept
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.archiveConcept = this.archiveConcept.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    if (this.props.levelNumber === 2) {
      return <div>
        <div className="concept-input-container">
          <Input
            label='Level 2'
            value={concept.name}
            type='search'
            id='concept-name'
          />
          {this.renderRenameAndArchiveSection()}
        </div>
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        {this.renderDropdownInput()}
        <div className="concept-input-container">
          <Input
            label='Level 1'
            value={concept.name}
            type='search'
            id='concept-name'
          />
          {this.renderRenameAndArchiveSection()}
        </div>
      </div>
    } else if (this.props.levelNumber === 0) {
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
            type='search'
            id='concept-name'
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
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={this.props.finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="concept-box">
            <form onSubmit={(e) => this.handleSubmit(e, editConcept)} acceptCharset="UTF-8" >
              <div className="static">
                <p>Level {this.props.levelNumber}</p>
                <h1>{this.state.concept.name}</h1>
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

export default ConceptBox
