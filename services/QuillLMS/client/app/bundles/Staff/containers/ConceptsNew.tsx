import * as React from "react";
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { 
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";

const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];

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

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      conceptName: Form.createFormField({
        ...props.conceptName,
        value: props.conceptName.value,
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
        {getFieldDecorator('conceptName', {
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
        conceptName: {
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
      console.log("new:  ", newState)
      return newState;
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('submitting', this.state);
  }

  render() {
    const fields = this.state.fields;
    return  (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Concept</Breadcrumb.Item>
        </Breadcrumb>
        <Divider></Divider>
        <CustomizedForm {...fields} onChange={this.handleFormChange} onSubmit={this.handleFormSubmit} />
      </div>
    )
  }
  
};

export default App