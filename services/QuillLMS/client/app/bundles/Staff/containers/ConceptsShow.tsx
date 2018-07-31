import * as React from "react";

import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';

const conceptsIndexQuery:string = `
  {
    concepts(childlessOnly: true) {
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
    }
  }
`
export interface Concept {
  id:string;
  name:string;
  parent?:Concept;
}
interface QueryResult {
  concepts: Array<Concept>
}



class App extends React.Component {
  constructor(props){
    super(props)
  }

  renderGrandparentCell(rowData:Concept) {
    if (rowData.parent && rowData.parent.parent) {
      const grandparent = rowData.parent.parent;
      return (
        <a href={`/cms/concepts/${grandparent.id}`}>
          {grandparent.name}
        </a>
      )
    }
  }

  renderParentCell(rowData:Concept) {
    if (rowData.parent) {
      const parent = rowData.parent;
      return (
        <a href={`/cms/concepts/${parent.id}`}>
          {parent.name}
        </a>
      )
    }
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
        <td>{this.renderGrandparentCell(row)}</td>
        <td>{this.renderParentCell(row)}</td>
        <td>{this.renderCell(row)}</td>
      </tr>
    ));
  }

  render() {
    return  (
      <ApolloProvider client={client}>
        <Query
          query={gql(conceptsIndexQuery)}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <table>
                <thead>
                  <tr>
                    <th>Grandparent</th>
                    <th>Parent</th>
                    <th>Concept</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderList(data)}
                </tbody>
              </table>
            )
          }}
        </Query>
      </ApolloProvider>
    )
  }
  
};

export default App