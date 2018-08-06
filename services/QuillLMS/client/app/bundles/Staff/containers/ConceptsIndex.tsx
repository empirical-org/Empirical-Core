import * as React from "react";

import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
import ConceptsTable from "../components/ConceptsTable";

const conceptsIndexQuery:string = `
  {
    concepts(childlessOnly: true) {
      id
      name
      createdAt
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
  createdAt?:number;
  parent?:Concept;
}
interface QueryResult {
  concepts: Array<Concept>
}



class App extends React.Component {
  constructor(props){
    super(props)
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
              <ConceptsTable concepts={data.concepts}/>
            )
          }}
        </Query>
      </ApolloProvider>
    )
  }
  
};

export default App

{/* <table>
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
              </table> */}