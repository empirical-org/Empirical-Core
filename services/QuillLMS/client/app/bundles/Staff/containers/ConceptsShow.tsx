import * as React from "react";
import {Link} from "react-router";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
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

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
      name
      description
      visible
      parent {
        id
        name
        parent {
          id
          name
        }
      }
      children {
        id
        name
      }
      siblings {
        id
        name
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

class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return  (
      <Query
        query={gql(conceptQuery(this.props.params.id))}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concept:QueryResult = data.concept;
          return (
            <div>
              <Breadcrumb>
                <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                <ConceptBreadCrumb concept={concept.parent ? concept.parent.parent : null} />
                <ConceptBreadCrumb concept={concept.parent} />
                <Breadcrumb.Item>{concept.name}</Breadcrumb.Item>
              </Breadcrumb>
              <Divider />

              <ConceptsShow concept={concept}/>
              
            </div>
          )
        }}
      </Query>
    )
  }
  
};

export default App