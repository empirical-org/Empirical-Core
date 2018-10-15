import React from 'react';
import {Form, Input, Cascader, Button} from 'antd';
import { Query } from "react-apollo";
import { TextEditor } from 'quill-component-library/dist/componentLibrary'
import { EditorState, ContentState } from 'draft-js'
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
      description: Form.createFormField({
        ...props.description,
        value: props.description.value,
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
      <FormItem label="Concept Description">
        {getFieldDecorator('description', {
          rules: [{ required: false }],
        })(<TextEditor
                    text={props.description.value}
                    handleTextChange={(e) => props.onChange({description: { value: e, name: 'description' }})}
                    EditorState={EditorState}
                    ContentState={ContentState}
                  />)}
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
