import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

import { Concept } from '../interfaces/interfaces';
import ArchivedConceptBox from "./ArchivedConceptBox";
import ConceptBox from "./ConceptBox";

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
      name
      description
      explanation
      visible
      updatedAt
      replacement {
        name
      }
      changeLogs {
        id
        action
        explanation
        createdAt
        user {
          name
        }
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

interface QueryResult {
  id:string;
  name:string;
  parent?:Concept;
  children: Array<Concept>;
  siblings: Array<Concept>;
  changeLogs?: Array<any>;
}

interface ConceptBoxContainerProps {
  conceptID: Number;
  visible: Boolean;
  levelNumber: Number;
  finishEditingConcept: Function;
  closeConceptBox: Function;
}

class ConceptBoxContainer extends React.Component<any, ConceptBoxContainerProps> {
  constructor(props){
    super(props)
  }

  render() {
    const { conceptID, visible, levelNumber, finishEditingConcept, closeConceptBox } = this.props
    return  (
      <Query
        query={gql(conceptQuery(conceptID))}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concept:QueryResult = data.concept;
          if (visible) {
            return (
              <div className="concept-box-container">
                <ConceptBox
                  closeConceptBox={closeConceptBox}
                  concept={concept}
                  finishEditingConcept={finishEditingConcept}
                  levelNumber={levelNumber}
                />
              </div>
            )
          } else {
            return (
              <div className="concept-box-container">
                <ArchivedConceptBox
                  closeConceptBox={closeConceptBox}
                  concept={concept}
                  finishEditingConcept={finishEditingConcept}
                  levelNumber={levelNumber}
                />
              </div>
            )
          }
        }}
      </Query>
    )
  }

};

export default ConceptBoxContainer
