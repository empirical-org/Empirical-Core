import * as React from "react";
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { 
  Breadcrumb, Divider, Form, Input 
} from "antd";

const FormItem = Form.Item;

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
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <FormItem label="Concept Name">
        {getFieldDecorator('conceptName', {
          rules: [{ required: true, message: 'Concept Name is required!' }],
        })(<Input />)}
      </FormItem>
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
      },
    };
  }

  handleFormChange = (changedFields) => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
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
        <CustomizedForm {...fields} onChange={this.handleFormChange} />
      </div>
    )
  }
  
};

export default App