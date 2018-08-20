import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Concept } from "../containers/ConceptsShow";
import ConceptForm from './ConceptForm';

const EDIT_CONCEPT = gql`
mutation editConcept($id: ID! $name: String, $parentId: ID){
    editConcept(input: {id: $id, name: $name, parentId: $parentId}){
      concept {
        id
        uid
        name
        parentId
      }
    }
  }
`;


export interface AppProps {
  concept: Concept
  redirectToShow(Concept): null
}

function getParentIdArray(concept:Concept):Array<Number>{
  const parentIdArray = [];
  const grandparentId:Number = concept.parent && concept.parent.parent ? parentIdArray.push(concept.parent.parent.id) : null;
  const parentId:Number = concept.parent ? parentIdArray.push(concept.parent.id) : null;
  return parentIdArray;
} 

class ConceptEditForm extends React.Component<AppProps, any> {
  constructor(props){
    super(props)
    this.state = {
      fields: {
        name: {
          value: props.concept.name,
        },
        parentId: {
          value: getParentIdArray(props.concept),
        },
      },
    };
  }

  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => {
      const newState =  {
        fields: { ...fields, ...changedFields },
      }
      return newState;
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
  }

  redirectToShow = (data) => {
    
    this.props.redirectToShow(data.editConcept.concept)
  }

  render() {
    const fields = this.state.fields;
    return (
      <Mutation mutation={EDIT_CONCEPT} onCompleted={this.redirectToShow}>
        {(editConcept, { data }) => (
          <ConceptForm {...fields} onChange={this.handleFormChange} formSubmitCopy={"Edit"} onSubmit={(e) => {
            e.preventDefault();
            editConcept({ variables: {id: this.props.concept.id, name: this.state.fields.name.value, parentId: this.state.fields.parentId.value[this.state.fields.parentId.value.length - 1]}});
          }} />
        )}
      </Mutation>
    )
  }
};

export default ConceptEditForm