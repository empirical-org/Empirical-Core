import * as React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import moment from 'moment'

import Input from '../../Teacher/components/shared/input'
import DropdownInput from '../../Teacher/components/shared/dropdown_input'
import { Concept } from '../interfaces/interfaces'

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
mutation editConcept($id: ID! $name: String, $parentId: ID, $visible: Boolean){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, visible: $visible}){
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
  levelNumber: Number;
  concept: Concept;
  finishEditingConcept(data:any): void;
}

interface ArchivedConceptBoxState {
  concept: Concept;
  errors: { level1?: string; level2?: string;}
}

class ArchivedConceptBox extends React.Component<ArchivedConceptBoxProps, ArchivedConceptBoxState> {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      errors: {}
    }

    this.changeLevel1 = this.changeLevel1.bind(this)
    this.changeLevel2 = this.changeLevel2.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.concept, nextProps.concept)) {
      this.setState({ concept: nextProps.concept, })
    }
  }

  handleSubmit(e, editConcept) {
    e.preventDefault()
    const { levelNumber } = this.props
    const { concept } = this.state
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
        visible: true
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

  renderDropdownInput() {
    const { concept, errors } = this.state
    if (this.props.levelNumber === 0) {
      return <Query
        query={gql(levelOneConceptsQuery())}
      >
        {({ loading, error, data }) => {
          console.log('error', error)
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const possibleConcepts = data.concepts;
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt, parent: c.parent }})
          const value = options.find(opt => opt.value === concept.parent.id)
          return <div className="concept-input-container">
            <DropdownInput
              label="Level 1"
              value={value}
              options={options}
              handleChange={this.changeLevel1}
              error={errors.level1}
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
          const options = possibleConcepts.map(c => {return { label: c.label, value: c.value, visible: c.visible, updatedAt: c.updatedAt }})
          const value = options.find(opt => opt.value === concept.parent.id)
          return <div className="concept-input-container">
            <DropdownInput
              label="Level 2"
              value={value}
              options={options}
              handleChange={this.changeLevel2}
              error={errors.level2}
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
        className="button contained primary medium"
      />
    } else if (levelNumber === 1 && concept.parent.visible) {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="button contained primary medium"
      />
    } else if (levelNumber === 0 && concept.parent.visible && concept.parent.parent.visible) {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="button contained primary medium"
      />
    } else {
      return <input
        type="submit"
        value="Unarchive, set live"
        className="button contained disabled primary medium"
      />
    }
  }

  render() {
    return  (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={this.props.finishEditingConcept}>
        {(editConcept, {}) => (
          <div className="concept-box archived-concept-box">
            <form onSubmit={(e) => this.handleSubmit(e, editConcept)} acceptCharset="UTF-8" >
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
