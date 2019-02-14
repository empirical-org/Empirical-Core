import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
import ConceptBox from "./ConceptBox";
import ArchivedConceptBox from "./ArchivedConceptBox";


function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
      name
      description
      visible
      updatedAt
      replacement {
        name
      }
      parent {
        id
        name
        visible
        updatedAt
        parent {
          id
          name
          visible
          updatedAt
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

interface ConceptBoxContainerProps {
  conceptID: Number;
  visible: Boolean;
  levelNumber: Number;
  finishEditingConcept: Function;
}

class ConceptBoxContainer extends React.Component<any, ConceptBoxContainerProps> {
  constructor(props){
    super(props)
  }

  render() {
    const { conceptID, visible, levelNumber, finishEditingConcept } = this.props
    return  (
      <Query
        query={gql(conceptQuery(conceptID))}
      >
        {({ loading, error, data }) => {
          console.log('error', error)
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concept:QueryResult = data.concept;
          console.log('concept', concept)
          if (visible) {
            return (
              <ConceptBox
                concept={concept}
                levelNumber={levelNumber}
                finishEditingConcept={finishEditingConcept}
              />
            )
          } else {
            return (
              <ArchivedConceptBox
                concept={concept}
                levelNumber={levelNumber}
                finishEditingConcept={finishEditingConcept}
              />
            )
          }
        }}
      </Query>
    )
  }

};

export default ConceptBoxContainer
