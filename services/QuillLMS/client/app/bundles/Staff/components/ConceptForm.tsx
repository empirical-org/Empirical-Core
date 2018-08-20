import React from 'react';
import {Form, Input, Cascader, Button} from 'antd';
import { Query } from "react-apollo";
import gql from '../../../../node_modules/graphql-tag';
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

const ConceptForm = Form.create({
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
        {props.formSubmitCopy} Level {2 - props.parentId.value.length} Concept
      </Button>
    </Form>
  );
});


export default ConceptForm