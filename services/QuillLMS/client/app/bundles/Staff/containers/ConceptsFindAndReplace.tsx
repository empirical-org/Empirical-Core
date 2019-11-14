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
      return <div className="success-banner"><span>You replaced a concept.</span><i className="fas fa-close" onClick={this.closeSuccessBanner} /></div>
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
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (<div className="find-and-replace-container">
              <a className="find-and-replace-guide" href="https://www.notion.so/quill/Concept-Manager-Guide-08b52d41f62f47e59856b14c91b4a95a" target="_blank">Guide For Find & Replace</a>
              <ConceptReplaceForm concepts={data.concepts} showSuccessBanner={this.showSuccessBanner} />
            </div>)
          }}
        </Query>
      </div>
      )
  }

};

export default ConceptsFindAndReplace
