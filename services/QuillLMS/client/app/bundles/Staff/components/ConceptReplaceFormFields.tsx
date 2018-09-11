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
        children {
          value: id
          label: name
        }
      }
    }
  }
`
}

const ConceptReplaceFormFields = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      replacementId: Form.createFormField({
        ...props.replacementId,
        value: props.replacementId.value,
      }),
    };
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form onSubmit={props.onSubmit}>
      <Query
        query={gql(parentConceptsQuery())}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const concepts:CascaderOptionType[] = data.concepts;
          return (
            <FormItem 
              label="Replacement Concept"
            >
              {getFieldDecorator('replacementId', {
                rules: [{ type: 'array', required: false }],
              })(
                <Cascader options={concepts}/>
              )}
            </FormItem>
          )
        }}
      </Query>
      <Button type="primary" htmlType="submit">
        Replace Concept
      </Button>
    </Form>
  );
});


export default ConceptReplaceFormFields