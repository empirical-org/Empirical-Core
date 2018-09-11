import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ConceptsTable from "../components/ConceptsTable";
import RadioGroup from "../../../../node_modules/antd/lib/radio/group";
import RadioButton from "../../../../node_modules/antd/lib/radio/radioButton";
import ConceptSearch from "../components/ConceptsSearch";
import Fuse from 'fuse.js'
import { Button } from "antd";
import { Link } from 'react-router';
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
  uid?:string
  name:string;
  description?:string;
  createdAt?:number;
  parent?:Concept;
  visible?:boolean;
  siblings?:Array<Concept>;
  children?:Array<Concept>;
  replacementId?:string;
}
interface QueryResult {
  concepts: Array<Concept>
}


interface AppState {
  visible: boolean,
  searchValue: string,
  fuse?: any
}


class App extends React.Component<any, AppState> {
  constructor(props){
    super(props)

    this.state = {
      visible: true,
      searchValue: '',
    }
    this.updateSearchValue = this.updateSearchValue.bind(this)
  }

  filterConcepts(concepts:Array<Concept>, searchValue:string):Array<Concept>{
    if (searchValue == '') {return concepts};
    if (this.state.fuse) {
      return this.state.fuse.search(searchValue)
    } else {
      const options = {
        shouldSort: true,
        caseSensitive: false,
        tokenize: true,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: [
          "name",
          "parent.name",
          "parent.parent.name"
        ]
      };
      const fuse = new Fuse(concepts, options);
      this.setState({fuse});
      return concepts;
    }
    
    
    // const results:Array<any>|null = fs.get(searchValue);
    // const resultsNames:Array<string> = results ? results.map(result => result[1]) : [];
  
    // console.log("fuzzy = ", results, fs);
    // return concepts.filter((concept) => {
    //   return resultsNames.indexOf(getSearchableConceptName(concept)) != -1
    // })
  }

  updateSearchValue(searchValue:string):void {
    this.setState({searchValue})
  }

  render() {
    return  (
      <div>
        <h3>Concepts <Link to="/new"><Button icon="plus" shape="circle" /></Link></h3>
        <Query
          query={gql(conceptsIndexQuery)}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div>
                <div className="concepts-index-tools">
                  <RadioGroup onChange={(e) => this.setState({visible: e.target.value})} defaultValue={this.state.visible}>
                    <RadioButton value={true}>Live</RadioButton>
                    <RadioButton value={false}>Archived</RadioButton>
                  </RadioGroup>
                  <ConceptSearch concepts={this.filterConcepts(data.concepts, this.state.searchValue)} searchValue={this.state.searchValue} updateSearchValue={this.updateSearchValue}/>
                </div>
                <ConceptsTable concepts={this.filterConcepts(data.concepts, this.state.searchValue)} visible={this.state.visible}/>
              </div>
            )
          }}
        </Query>
      </div>
      
    )
  }
  
};

export default App