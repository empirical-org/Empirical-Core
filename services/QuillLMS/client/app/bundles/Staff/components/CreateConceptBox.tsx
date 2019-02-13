import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import _ from 'lodash'

import Input from '../../Teacher/components/shared/input'
import DropdownInput from '../../Teacher/components/shared/dropdown_input'

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
  concepts: [Concept];
}

interface CreateConceptBoxState {
  concept: { parent: Concept|{}, name: string }
  level1Concepts: [Concept],
  level2Concepts: [Concept]
}

class CreateConceptBox extends React.Component<CreateConceptBoxProps, CreateConceptBoxState> {
  constructor(props){
    super(props)

    const { level2Concepts, level1Concepts } = this.sortConcepts(props)

    this.state = {
      concept: { name: '', parent: {}},
      level2Concepts,
      level1Concepts
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.renameConcept = this.renameConcept.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  sortConcepts(props):{level2Concepts: [Concept], level1Concepts: [Concept]} {
    let level1Concepts:[Concept] = []
    let level2Concepts:[Concept] = []
    props.concepts.forEach(c => {
      if (c.parent && !c.parent.parent) {
        level1Concepts.push(c)
      } else if (!c.parent) {
        level2Concepts.push(c)
      }
    })
    return { level2Concepts, level1Concepts }
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
    const { concept, level1Concepts, } = this.state
    const savedLevel1Concept = level1Concepts.find(c => c.id === level1Concept.value)
    const newParent = {
      id: savedLevel1Concept.id,
      name: savedLevel1Concept.name,
      parent: {
        id: savedLevel1Concept.parent.id,
        name: savedLevel1Concept.parent.name
      }
    }
    const newConcept = Object.assign({}, concept, { parent: newParent })
    this.setState({ concept: newConcept })
  }

  changeLevel2(level2Concept) {
    const newParent = {
      id: level2Concept.value,
      name: level2Concept.label,
    }
    let newConcept
    if (this.props.levelNumber === 1) {
      newConcept = Object.assign({}, this.state.concept, { parent: newParent })
    } else {
      newConcept = Object.assign({}, this.state.concept, { parent: { parent: newParent, } })
    }
    this.setState({ concept: newConcept })
  }

  activateConceptInput() {
    document.getElementById('concept-name').focus()
  }

  renderDropdownInput(dropdownLevel) {
    const { concept, level1Concepts, level2Concepts } = this.state
    const { levelNumber} = this.props
    if (dropdownLevel === 1) {
      let possibleConcepts = level1Concepts
      if (concept.parent && concept.parent.parent && concept.parent.parent.id) {
        possibleConcepts = level1Concepts.filter(c => c.parent.id === concept.parent.parent.id)
      }
      const options = possibleConcepts.map(c => {return { label: c.name, value: c.id }})
      const value = options.find(opt => opt.value === concept.parent.id)
      return <DropdownInput
        label="Level 1"
        value={value}
        options={options}
        handleChange={this.changeLevel1}
      />
    } else {
      let possibleConcepts = level2Concepts
      if (levelNumber === 0 && concept.parent.id) {
        possibleConcepts = [concept.parent.parent]
      }
      const options = possibleConcepts.map(c => {return { label: c.name, value: c.id }})
      let value
      if (levelNumber === 0 && concept.parent.parent) {
        value = options.find(opt => opt.value === concept.parent.parent.id)
      } else {
        value = options.find(opt => opt.value === concept.parent.id)
      }
      return <DropdownInput
        label="Level 2"
        value={value}
        options={options}
        handleChange={this.changeLevel2}
      />
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
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        {this.renderDropdownInput(2)}
        <div className="concept-input-container">
          <Input
            label='Level 1'
            value={concept.name}
            type='text'
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    } else if (this.props.levelNumber === 0) {
      return <div>
        {this.renderDropdownInput(2)}
        {this.renderDropdownInput(1)}
        <div className="concept-input-container">
          <Input
            label='Level 0'
            value={concept.name}
            type='text'
            handleChange={this.renameConcept}
          />
        </div>
      </div>
    }
  }

  renderSaveButton() {
    const { levelNumber } = this.props
    const { concept } = this.state
    if (levelNumber === 2 && concept.name) {
      return <input
        type="submit"
        value={`Add New Level ${this.props.levelNumber}`}
        className="button contained primary medium"
      />
    } else if ((levelNumber === 1 || levelNumber === 2) && concept.parent.id) {
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
