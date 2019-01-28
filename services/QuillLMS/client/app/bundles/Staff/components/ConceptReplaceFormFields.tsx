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
      replacedId: Form.createFormField({
        ...props.replacedId,
        value: props.replacedId.value,
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
          let replacedConceptField
          const replacementConceptField = (
            <FormItem
              label="Replace with this tag"
            >
              {getFieldDecorator('replacementId', {
                rules: [{ type: 'array', required: true }],
              })(
                <Cascader options={concepts}/>
              )}
            </FormItem>
          )
          if (!props.onConceptPage) {
            replacedConceptField = (
              <FormItem
                label="Find this tag"
              >
                {getFieldDecorator('replacedId', {
                  rules: [{ type: 'array', required: true }],
                })(
                  <Cascader options={concepts}/>
                )}
              </FormItem>
            )
          }
          return <div>
            {replacedConceptField}
            {replacementConceptField}
          </div>
        }}
      </Query>
      <Button type="primary" htmlType="submit">
        Replace Concept
      </Button>
    </Form>
  );
});


export default ConceptReplaceFormFields
