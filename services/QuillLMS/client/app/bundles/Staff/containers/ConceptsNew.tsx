import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import { 
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";

const FormItem = Form.Item;

function parentConceptsQuery(){
  return `
  {
    concepts(levelTwoOnly: true) {
      value: id
      label: name
      children {
        value: id
        label: name
      }
    }
  }
`
}

const CREATE_CONCEPT = gql`
  mutation createConcept($name: String!, $parentId: ID){
    createConcept(input: {name: $name, parentId: $parentId}){
      concept {
        id
        uid
        name
        parentId
      }
    }
  }
`;

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        ...props.name,
        value: props.name.value,
      }),
      parentId: Form.createFormField({
        ...props.parentId,
        value: props.parentId.value,
      }),
    };
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={props.onSubmit}>
      <FormItem label="Concept Name">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Concept Name is required!' }],
        })(<Input />)}
      </FormItem>
      <Query
        query={gql(parentConceptsQuery())}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concepts:CascaderOptionType[] = data.concepts;
          return (
            <FormItem
              label="Parent Concept"
            >
              {getFieldDecorator('parentId', {
                rules: [{ type: 'array', required: false }],
              })(
                <Cascader options={concepts} changeOnSelect/>
              )}
            </FormItem>
          )
        }}
      </Query>
      <Button type="primary" htmlType="submit">
        Create New Level {2 - props.parentId.value.length} Concept
      </Button>
    </Form>
  );
});

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      fields: {
        name: {
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

  redirectToShow = (data) => {
    console.log("Called")
    this.props.router.push(data.createConcept.concept.id)
  }

  render() {
    const fields = this.state.fields;
    return  (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>Create A New Concept</Breadcrumb.Item>
        </Breadcrumb>
        <Divider></Divider>
        <Mutation mutation={CREATE_CONCEPT} onCompleted={this.redirectToShow}>
          {(createConcept, { data }) => (
            <CustomizedForm {...fields} onChange={this.handleFormChange} onSubmit={(e) => {
              e.preventDefault();
              createConcept({ variables: {name: this.state.fields.name.value, parentId: this.state.fields.parentId.value[this.state.fields.parentId.value.length - 1]}});
            }} />
          )}
        </Mutation>
      </div>
    )
  }
  
};

export default App