import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ConceptReplaceForm from '../components/ConceptReplaceForm';
import ConceptManagerNav from "../components/ConceptManagerNav";

const levelZeroConcepts:string = `
  {
    concepts(levelZeroOnly: true) {
      id
      name
      uid
      parent {
        name
        id
        parent {
          name
          id
        }
      }
    }
  }
`

interface ConceptsFindAndReplaceState {
  showSuccessBanner: Boolean;
}

interface ConceptsFindAndReplaceProps {
}


class ConceptsFindAndReplace extends React.Component<ConceptsFindAndReplaceProps, ConceptsFindAndReplaceState> {
  constructor(props){
    super(props)

    this.state = { showSuccessBanner: false }

    this.closeSuccessBanner = this.closeSuccessBanner.bind(this)
    this.showSuccessBanner = this.showSuccessBanner.bind(this)
  }

  renderSuccessBanner() {
    if (this.state.showSuccessBanner) {
      return <div className="success-banner"><span>You replaced a concept.</span><i className="fa fa-close" onClick={this.closeSuccessBanner}/></div>
    }
  }

  closeSuccessBanner() {
    this.setState({ showSuccessBanner: false })
  }

  showSuccessBanner() {
    this.setState({ showSuccessBanner: true })
  }

  render() {
    return (
      <div>
        <ConceptManagerNav />
        {this.renderSuccessBanner()}
        <Query
          query={gql(levelZeroConcepts)}
        >
          {({ loading, error, data }) => {
            console.log('error', error)
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return <ConceptReplaceForm showSuccessBanner={this.showSuccessBanner} concepts={data.concepts}/>
          }}
        </Query>
      </div>
      )
  }

};

export default ConceptsFindAndReplace
