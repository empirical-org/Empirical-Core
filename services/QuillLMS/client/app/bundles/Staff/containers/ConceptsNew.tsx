import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ConceptManagerNav from "../components/ConceptManagerNav";
import ConceptBoxContainer from "../components/ConceptBoxContainer"
import CreateConceptBox from "../components/CreateConceptBox"
import ConceptLevels from "../components/ConceptLevels";
import { Concept } from '../interfaces/interfaces'

const allConceptsQuery:string = `
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
        parent {
          id
          name
        }
      }
      children {
        id
        name
      }
    }
  }
`

interface AddConceptState {
  selectedConcept: { conceptID?: Number, levelNumber?: Number };
  showSuccessBanner: Boolean;
}

class AddConcept extends React.Component<{}, AddConceptState> {
  constructor(props){
    super(props)

    this.state = {
      selectedConcept: {},
      showSuccessBanner: false
    }

    this.selectConcept = this.selectConcept.bind(this)
    this.finishEditingOrCreatingConcept = this.finishEditingOrCreatingConcept.bind(this)
    this.closeEditSuccessBanner = this.closeEditSuccessBanner.bind(this)
    this.closeConceptBox = this.closeConceptBox.bind(this)
  }

  finishEditingOrCreatingConcept(refetch) {
    refetch()
    this.setState({ showSuccessBanner: true, selectedConcept: {} })
  }

  closeEditSuccessBanner() {
    this.setState({ showSuccessBanner: false })
  }

  selectConcept(conceptID, levelNumber) {
    this.setState({ selectedConcept: { conceptID, levelNumber }})
  }

  closeConceptBox() {
    this.setState({ selectedConcept: {} })
  }

  renderContent() {
    return <Query
      query={gql(allConceptsQuery)}
    >
    {({ loading, error, data, refetch, networkStatus }) => {
        if (networkStatus === 4) return <p>Refetching!</p>;
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        const concepts:Array<Concept> = data.concepts.filter(c => c.visible);
        return <div className="concept-levels-and-forms-container">
          <ConceptLevels
            concepts={concepts}
            selectConcept={this.selectConcept}
            selectedConcept={this.state.selectedConcept}
            unselectConcept={this.closeConceptBox}
          />
          {this.renderConceptForms(refetch, concepts)}
        </div>
      }}
    </Query>
  }

  renderConceptForms(refetch, concepts) {
    const { conceptID, levelNumber } = this.state.selectedConcept
    if (conceptID && (levelNumber || levelNumber === 0)) {
      return (<div>
        <ConceptBoxContainer
          conceptID={conceptID}
          levelNumber={levelNumber}
          finishEditingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
          visible={true}
          closeConceptBox={this.closeConceptBox}
        />
        {this.renderAddNewConceptsForms(refetch, concepts)}
      </div>)
    } else {
      return this.renderAddNewConceptsForms(refetch, concepts)
    }
  }

  renderAddNewConceptsForms(refetch, concepts) {
    return <div className="new-concept-forms">
      <div className="concept-guide-section">
        <i className="fas fa-book-open"></i>
        <div>
          <a target="_blank" href="https://docs.google.com/document/d/1pWdDMGlqpoIjO75lIe6gfYMo3v4L7mAZjN2VBpwehhk/edit#heading=h.5sblht1hha9p">Concept Guide</a>
          <p>Are you an intern, or not sure how to create a Concept? Then please read our documentation.</p>
        </div>
      </div>
      <CreateConceptBox
        levelNumber={2}
        concepts={concepts}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
      <CreateConceptBox
        levelNumber={1}
        concepts={concepts}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
      <CreateConceptBox
        levelNumber={0}
        concepts={concepts}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
    </div>
  }

  renderEditSuccessBanner() {
    if (this.state.showSuccessBanner) {
      return <div className="success-banner"><span>You saved a concept.</span><span onClick={this.closeEditSuccessBanner}><i className="fa fa-close"/></span></div>
    }
  }


  render() {
    return  (
      <div>
        <ConceptManagerNav />
        {this.renderEditSuccessBanner()}
        <div className="new-concept-container">
          {this.renderContent()}
        </div>
      </div>
    )
  }

};

export default AddConcept
