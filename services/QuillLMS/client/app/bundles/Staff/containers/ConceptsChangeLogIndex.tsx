import Fuse from 'fuse.js';
import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

import ChangeLogTable from "../components/ChangeLogTable";
import ConceptManagerNav from "../components/ConceptManagerNav";
import Search from "../components/shared/search";
import { ChangeLog } from '../interfaces/interfaces';

const conceptsChangeLogIndexQuery:string = `
{
  changeLogs(conceptChangeLogs: true) {
    id
    action
    explanation
    createdAt
    previousValue
    changedAttribute
    concept {
      name
      uid
    }
    user {
      name
    }
  }
}
`

interface ConceptsChangeLogState {
  searchValue: string,
  fuse?: any
}

class ConceptsChangeLog extends React.Component<any, ConceptsChangeLogState> {
  constructor(props){
    super(props)

    this.state = {
      searchValue: ''
    }
    this.updateSearchValue = this.updateSearchValue.bind(this)
  }

  filterChangeLog(changeLogs:Array<ChangeLog>, searchValue:string):Array<ChangeLog>{
    if (searchValue == '') {return changeLogs};
    if (this.state.fuse) {
      return this.state.fuse.search(searchValue)
    } else {
      const options = {
        shouldSort: true,
        caseSensitive: false,
        tokenize: true,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        threshold: 0.0,
        keys: [
          "concept.name",
          "concept.uid"
        ]
      };
      const fuse = new Fuse(changeLogs, options);
      this.setState({fuse});
      return changeLogs;
    }
  }

  updateSearchValue(searchValue:string):void {
    this.setState({searchValue})
  }

  renderConceptsChangeLog(data) {
    return (
      <ChangeLogTable
        changeLogs={this.filterChangeLog(data.changeLogs, this.state.searchValue)}
      />
    )
  }

  render() {
    return  (
      <div>
        <ConceptManagerNav />
        <Query
          notifyOnNetworkStatusChange
          query={gql(conceptsChangeLogIndexQuery)}
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4) return <p>Refetching!</p>;
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div className="concepts-change-log-index">
                <div className="concepts-change-log-index-top">
                  <Search
                    placeholder="Search by concept name or UID"
                    searchValue={this.state.searchValue}
                    updateSearchValue={this.updateSearchValue}
                  />
                </div>
                <div className="concepts-change-log-index-bottom">
                  <div className="concepts-change-log-table-container">
                    <div>
                      {this.renderConceptsChangeLog(data)}
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        </Query>
      </div>

    )
  }

};

export default ConceptsChangeLog
