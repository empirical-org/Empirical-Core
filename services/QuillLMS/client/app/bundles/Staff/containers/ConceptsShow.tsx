import * as React from "react";

import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      name
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
        <h2>Grandparent: <a href={`/cms/concepts/${grandparent.id}`}>{grandparent.name}</a></h2>
      )
    }
  }

  renderParent(concept:QueryResult){
    if (concept.parent) {
      const {parent} = concept;
      return (
        <h2>Parent: <a href={`/cms/concepts/${parent.id}`}>{parent.name}</a></h2>
      )
    }
  }

  renderChildren(concept:QueryResult){
    return (
      <div>
        <h4>Children</h4>
        <ul>
          {(concept.children.map(({id, name}) => {
            return (
              <li key={id}><a href={`/cms/concepts/${id}`}>{name}</a></li>
            )
          }))}  
        </ul>
      </div>
    )
  }

  renderSiblings(concept:QueryResult){
    return (
      <div>
        <h4>Siblings</h4>
        <ul>
          {(concept.siblings.map(({id, name}) => {
            return (
              <li key={id}><a href={`/cms/concepts/${id}`}>{name}</a></li>
            )
          }))}  
        </ul>
      </div>
    )
  }

  render() {
    return  (
      <ApolloProvider client={client}>
        <Query
          query={gql(conceptQuery(this.props.concept_id))}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const concept:QueryResult = data.concept;
            return (
              <div>
                <h1>{concept.name}</h1>
                {this.renderParent(concept)}
                {this.renderGrandparent(concept)}
                {this.renderSiblings(concept)}
                {this.renderChildren(concept)}
              </div>
            )
          }}
        </Query>
      </ApolloProvider>
    )
  }
  
};

export default App