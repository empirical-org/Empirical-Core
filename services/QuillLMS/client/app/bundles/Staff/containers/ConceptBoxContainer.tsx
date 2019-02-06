import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
import ConceptBox from "../components/ConceptBox";

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
    concepts(levelTwoOnly: true) {
      value: id
      label: name
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

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
      name
      description
      visible
      replacementId
      parent {
        id
        name
        parent {
          id
          name
          children {
            id
            name
          }
        }
      }
    }
  }
`
}
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

class ConceptBoxContainer extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return  (
      <Query
        query={gql(conceptQuery(this.props.conceptID))}
      >
        {({ loading, error, data }) => {
          debugger;
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concept:QueryResult = data.concept;
          console.log('concept', concept)
          return (
            <ConceptBox concept={concept} levelNumber={this.props.levelNumber} />
          )
        }}
      </Query>
    )
  }

};

export default ConceptBoxContainer
