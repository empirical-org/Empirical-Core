import * as React from "react";
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { 
  Breadcrumb, Divider, Form, 
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



class App extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return  (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item>New Concept</Breadcrumb.Item>
        </Breadcrumb>
        <Divider></Divider>
        <Form onSubmit={() => {alert("submitted")}}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input a name for the concept!' }],
            })(
              <Input placeholder="Name" />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
  
};

export default App