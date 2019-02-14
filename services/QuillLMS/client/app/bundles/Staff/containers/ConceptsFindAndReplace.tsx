import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import {
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";
import ConceptReplaceForm from '../components/ConceptReplaceForm';
import ConceptManagerNav from "../components/ConceptManagerNav";

const FormItem = Form.Item;

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

const levelZeroConcepts:string = `
  {
    concepts(levelZeroOnly: true) {
      id
      name
      parent {
        name
        parent {
          name
        }
      }
    }
  }
`


class ConceptsFindAndReplace extends React.Component {
  constructor(props){
    super(props)

    this.state = { showSuccessBanner: false }

    this.closeSuccessBanner = this.closeSuccessBanner.bind(this)
    this.showSuccessBanner = this.showSuccessBanner.bind(this)
  }

  renderSuccessBanner() {
    if (this.state.showSuccessBanner) {
      return <div className="success-banner"><span>You replaced a concept.</span><i className="fa fa-close" onClick={this.closeEditSuccessBanner}/></div>
    }
  }

  closeSuccessBanner() {
    this.setState({ closeSuccessBanner: false })
  }

  showSuccessBanner() {
    this.setState({ closeSuccessBanner: true })
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
