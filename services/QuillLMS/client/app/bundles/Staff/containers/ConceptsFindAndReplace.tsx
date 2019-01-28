import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import {
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";
import ConceptBreadCrumb from "../components/ConceptBreadCrumb";
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

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
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


class ConceptsFindAndReplace extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fields: {
        replacementId: {
          value: [],
        },
      },
    };
  }

  handleFormChange = (changedFields) => {
    console.log(changedFields)
    this.setState(({ fields }) => {
      const newState =  {
        fields: { ...fields, ...changedFields },
      }
      console.log("new: ", newState)
      return newState;
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('submitting', this.state);
  }

  redirectToShow = (concept:Concept) => {
    this.props.router.push(concept.id)
  }

  render() {
    return (
      <div>
        <ConceptManagerNav />
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Find & Replace</Breadcrumb.Item>
        </Breadcrumb>
        <Divider></Divider>
        <ConceptReplaceForm concept={{}} redirectToShow={this.redirectToShow}/>
      </div>
      )
  }

};

export default ConceptsFindAndReplace
