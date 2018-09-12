import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import { 
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";
import ConceptBreadCrumb from "../components/ConceptBreadCrumb";
import ConceptEditForm from "../components/ConceptEditForm";

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
      description
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


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fields: {
        name: {
          value: null,
        },
        description: {
          value: null,
        },
        parentId: {
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
    const fields = this.state.fields;
    return (
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
              <ConceptBreadCrumb concept={concept} />
              <Breadcrumb.Item>Edit</Breadcrumb.Item>
            </Breadcrumb>
            <Divider></Divider>
            <ConceptEditForm concept={concept} redirectToShow ={this.redirectToShow}/>
          </div>
          )
        }}
      </Query>
    ) 
  }
  
};

export default App