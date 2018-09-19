import React from 'react';
import {Tag} from 'antd';
import {Concept} from '../containers/ConceptsIndex'
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      name
    }
  }
`
}

export interface ConceptShowProps {
  concept: Concept
}

const ReplacedWithLink: React.SFC<ConceptShowProps> = ({concept}) => {
  if (concept.replacementId) {
    return (
      <Query
        query={gql(conceptQuery(concept.replacementId))}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const replacement:QueryResult = data.concept;
          return (
            <Link to={'/' + concept.replacementId}>
              <Tag color="volcano">Replaced with {replacement.name}</Tag>
            </Link>
          )
        }}
      </Query>
    )
  }
  return null
} 

export default ReplacedWithLink