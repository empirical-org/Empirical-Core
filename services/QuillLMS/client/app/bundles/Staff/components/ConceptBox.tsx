import * as React from "react";
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
import Input from '../../Teacher/components/shared/input'
import {
  Breadcrumb,
  Divider,
  Card,
  List,
  Row,
  Col,
} from "antd";
import ConceptsShow from "../components/ConceptsShow";
import ConceptBreadCrumb from '../components/ConceptBreadCrumb';

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

class ConceptBox extends React.Component {
  constructor(props){
    super(props)
  }

  renderLevels(concept) {
    if (this.props.levelNumber === 2) {
      return <div>
        <Input
          label='Level 2'
          value={concept.name}
          type='text'
        />
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        <Input
          label='Level 1'
          value={concept.name}
          type='text'
        />
      </div>
    } else if (this.props.levelNumber === 0) {
      return <div>
        <Input
          label='Level 0'
          value={concept.name}
          type='text'
        />
      </div>
    }
  }

  render() {
    return  (
      <Query
        query={gql(conceptQuery(this.props.conceptID))}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concept:QueryResult = data.concept;
          console.log('concept', concept)
          return (
            <div className="concept-box">
              <p>Level {this.props.levelNumber}</p>
              <h1>{concept.name}</h1>
              <p>UID: {concept.uid}</p>
              {this.renderLevels(concept)}
            </div>
          )
        }}
      </Query>
    )
  }

};

export default ConceptBox
