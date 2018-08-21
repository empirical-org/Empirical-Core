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

  renderCell(rowData:Concept) {
    return (
      <a href={`/cms/concepts/${rowData.id}`}>
        {rowData.name}
      </a>
    )
  }

  renderList(data:QueryResult) {
    return data.concepts.map((row) => (
      <tr key={row.id}>
        <td>{this.renderCell(row)}</td>
      </tr>
    ));
  }

  renderGrandparent(concept:QueryResult){
    if (concept.parent && concept.parent.parent) {
      const grandparent = concept.parent.parent;
      return (
        <Breadcrumb.Item><Link to={grandparent.id}>{grandparent.name}</Link></Breadcrumb.Item>
      )
    }
  }

  renderParent(concept:QueryResult){
    if (concept.parent) {
      const {parent} = concept;
      return (
        <Breadcrumb.Item><Link to={parent.id}>{parent.name}</Link></Breadcrumb.Item>
      )
    }
  }

  renderChildren(concept:QueryResult){
    return (  
      <List
        size="small"
        header={<div>Children</div>}
        bordered
        dataSource={concept.children}
        renderItem={({id, name}) => (<List.Item><Link to={id}>{name}</Link></List.Item>)}
      />
    )
  }

  renderSiblings(concept:QueryResult){
    return (  
      <List
        size="small"
        header={<div>Siblings</div>}
        bordered
        dataSource={concept.siblings}
        renderItem={({id, name}) => (<List.Item><Link to={id}>{name}</Link></List.Item>)}
      />
    )
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