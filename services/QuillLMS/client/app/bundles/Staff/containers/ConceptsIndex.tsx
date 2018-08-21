import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ConceptsTable from "../components/ConceptsTable";
import RadioGroup from "../../../../node_modules/antd/lib/radio/group";
import RadioButton from "../../../../node_modules/antd/lib/radio/radioButton";

const conceptsIndexQuery:string = `
  {
    concepts(childlessOnly: true) {
      id
      name
      createdAt
      visible
      parent {
        id
        name
        parent {
          id
          name
        }
      }
    }
  }
`
export interface Concept {
  id:string;
  name:string;
  createdAt?:number;
  parent?:Concept;
  visible?:Boolean
}
interface QueryResult {
  concepts: Array<Concept>
}



class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      visible: true
    }
  }

  sey

  render() {
    return  (
      <div>
        <h3>Concepts</h3>
        <RadioGroup onChange={(e) => this.setState({visible: e.target.value})} defaultValue={this.state.visible}>
          <RadioButton value={true}>Live</RadioButton>
          <RadioButton value={false}>Archived</RadioButton>
        </RadioGroup>
        <Query
          query={gql(conceptsIndexQuery)}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <ConceptsTable concepts={data.concepts} visible={this.state.visible}/>
            )
          }}
        </Query>
      </div>
      
    )
  }
  
};

export default App