import Fuse from 'fuse.js';
import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";
import ConceptBoxContainer from "../components/ConceptBoxContainer";
import ConceptLevels from "../components/ConceptLevels";
import ConceptManagerNav from "../components/ConceptManagerNav";
import ConceptsTable from "../components/ConceptsTable";
import Search from "../components/shared/search";
const conceptsIndexQuery:string = `
  {
    concepts {
      id
      name
      createdAt
      visible
      uid
      parent {
        id
        name
        uid
        parent {
          id
          name
          uid
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
  explanation?:string;
  createdAt?:number;
  parent?:Concept;
  visible?:boolean;
  siblings?:Array<Concept>;
  children?:Array<Concept>;
  replacementId?:string;
}

interface ConceptsIndexState {
  visible: boolean,
  searchValue: string,
  showEditSuccessBanner: boolean,
  selectedConcept: { levelNumber?: Number, conceptID?: Number},
  fuse?: any
}


class ConceptsIndex extends React.Component<any, ConceptsIndexState> {
  constructor(props){
    super(props)

    this.state = {
      visible: true,
      searchValue: '',
      selectedConcept: {},
      showEditSuccessBanner: false
    }
    this.updateSearchValue = this.updateSearchValue.bind(this)
    this.selectConcept = this.selectConcept.bind(this)
    this.closeConceptBox = this.closeConceptBox.bind(this)
    this.finishEditingConcept = this.finishEditingConcept.bind(this)
    this.closeEditSuccessBanner = this.closeEditSuccessBanner.bind(this)
    this.setVisible = this.setVisible.bind(this)
  }

  finishEditingConcept(refetch) {
    this.setState({ showEditSuccessBanner: true, selectedConcept: {}, searchValue: '' }, () => refetch())
  }

  closeEditSuccessBanner() {
    this.setState({ showEditSuccessBanner: false })
  }

  setVisible(visible) {
    this.setState({ visible, selectedConcept: {}, searchValue: '' })
  }

  filterConcepts(concepts:Array<Concept>, searchValue: string):Array<Concept>{
    const { fuse, } = this.state
    if (searchValue == '') {return concepts};
    if (fuse) {
      return fuse.search(searchValue)
    } else {
      const options = {
        shouldSort: true,
        caseSensitive: false,
        tokenize: true,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        threshold: 0.0,
        keys: [
          "name",
          "parent.name",
          "parent.parent.name",
          "uid",
          "parent.uid",
          "parent.parent.uid"
        ]
      };
      const fuse = new Fuse(concepts, options);
      this.setState({fuse});
      return concepts;
    }
  }

  updateSearchValue(e):void {
    this.setState({searchValue: e.target.value})
  }

  selectConcept(conceptID, levelNumber) {
    this.setState({ selectedConcept: { conceptID, levelNumber }})
  }

  closeConceptBox() {
    this.setState({ selectedConcept: {} })
  }

  renderConceptBox(refetch) {
    const { selectedConcept, visible } = this.state
    const { conceptID, levelNumber } = selectedConcept
    if (conceptID && (levelNumber || levelNumber === 0)) {
      return (
        <ConceptBoxContainer
          closeConceptBox={this.closeConceptBox}
          conceptID={conceptID}
          finishEditingConcept={() => this.finishEditingConcept(refetch)}
          levelNumber={levelNumber}
          visible={visible}
        />
      )
    }
  }

  renderEditSuccessBanner() {
    if (this.state.showEditSuccessBanner) {
      return <div className="success-banner"><span>You saved a concept.</span><i className="fas fa-close" onClick={this.closeEditSuccessBanner} /></div>
    }
  }

  renderLiveAndArchivedTabs() {
    const { visible } = this.state
    const className = "interactive-wrapper focus-on-light"
    return (
      <div className="cms-tabs">
        <button className={visible ? `${className} active` : className} onClick={() => this.setVisible(true)} type="button">Live</button>
        <button className={visible ? className : `${className} active`} onClick={() => this.setVisible(false)} type="button">Archived</button>
      </div>
    )
  }

  renderConcepts(data) {
    if (this.state.visible) {
      return (
        <ConceptsTable
          concepts={this.filterConcepts(data.concepts, this.state.searchValue)}
          selectConcept={this.selectConcept}
          visible={this.state.visible}
        />
      )
    } else {
      return (
        <ConceptLevels
          concepts={this.filterConcepts(data.concepts, this.state.searchValue).filter(c => !c.visible)}
          selectConcept={this.selectConcept}
          selectedConcept={this.state.selectedConcept}
          unselectConcept={this.closeConceptBox}
        />
      )
    }
  }

  render() {
    return  (
      <div>
        <ConceptManagerNav />
        {this.renderEditSuccessBanner()}
        <Query
          notifyOnNetworkStatusChange
          query={gql(conceptsIndexQuery)}
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4) return <p>Refetching!</p>;
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div className="concepts-index">
                <div className="concepts-index-top">
                  <Search
                    placeholder="Search by concept name or UID"
                    searchValue={this.state.searchValue}
                    updateSearchValue={this.updateSearchValue}
                  />
                  {this.renderLiveAndArchivedTabs()}
                </div>
                <div className="concepts-index-bottom">
                  <div className="concepts-table-container">
                    <div>
                      {this.renderConcepts(data)}
                    </div>
                  </div>
                  {this.renderConceptBox(refetch)}
                </div>
              </div>
            )
          }}
        </Query>
      </div>

    )
  }

};

export default ConceptsIndex
