import * as React from "react";

import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';

const conceptsIndexQuery:string = `
  {
    concepts {
      id
      name
    }
  }
`

class App extends React.Component {
  constructor(props){
    super(props)
  }

  renderList(data) {
    return data.concepts.map(({ id, name }) => (
      <div key={id}>
        <p>{`${name}`}</p>
      </div>
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
              <div>
                {this.renderList(data)}
              </div>
            )
          }}
        </Query>
      </ApolloProvider>
    )
  }
  
};

export default App