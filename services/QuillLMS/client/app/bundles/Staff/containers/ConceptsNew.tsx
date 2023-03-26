import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";
import ConceptBoxContainer from "../components/ConceptBoxContainer";
import ConceptLevels from "../components/ConceptLevels";
import ConceptManagerNav from "../components/ConceptManagerNav";
import CreateConceptBox from "../components/CreateConceptBox";
import { Concept } from '../interfaces/interfaces';

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
    this.handleClickCloseEditSuccessBanner = this.handleClickCloseEditSuccessBanner.bind(this)
    this.closeConceptBox = this.closeConceptBox.bind(this)
  }

  finishEditingOrCreatingConcept(refetch) {
    refetch()
    this.setState({ showSuccessBanner: true, selectedConcept: {} })
  }

  handleClickCloseEditSuccessBanner() {
    this.setState({ showSuccessBanner: false })
  }

  selectConcept(conceptID, levelNumber) {
    this.setState({ selectedConcept: { conceptID, levelNumber }})
  }

  closeConceptBox() {
    this.setState({ selectedConcept: {} })
  }

  renderContent() {
    return (
      <Query
        query={gql(allConceptsQuery)}
      >
        {({ loading, error, data, refetch, networkStatus }) => {
          if (networkStatus === 4) return <p>Refetching!</p>;
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const { selectedConcept, } = this.state
          const concepts:Array<Concept> = data.concepts.filter(c => c.visible);
          return (
            <div className="concept-levels-and-forms-container">
              <ConceptLevels
                concepts={concepts}
                selectConcept={this.selectConcept}
                selectedConcept={selectedConcept}
                unselectConcept={this.closeConceptBox}
              />
              {this.renderConceptForms(refetch, concepts)}
            </div>
          )
        }}
      </Query>
    )
  }

  // disabling the no-bind rule for the following two functions because we have to use the refetch that gets passed in on every render
  /* eslint-disable react/jsx-no-bind */
  renderConceptForms(refetch, concepts) {
    const { selectedConcept, } = this.state
    const { conceptID, levelNumber } = selectedConcept
    if (conceptID && (levelNumber || levelNumber === 0)) {
      return (
        <div>
          <ConceptBoxContainer
            closeConceptBox={this.closeConceptBox}
            conceptID={conceptID}
            finishEditingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
            levelNumber={levelNumber}
            visible={true}
          />
          {this.renderAddNewConceptsForms(refetch, concepts)}
        </div>
      )
    } else {
      return this.renderAddNewConceptsForms(refetch, concepts)
    }
  }

  renderAddNewConceptsForms(refetch, concepts) {
    return (
      <div className="new-concept-forms">
        <div className="concept-guide-section">
          <i className="fas fa-book-open" />
          <div>
            <a href="https://docs.google.com/document/d/1pWdDMGlqpoIjO75lIe6gfYMo3v4L7mAZjN2VBpwehhk/edit#heading=h.5sblht1hha9p" rel="noopener noreferrer" target="_blank">Concept Guide</a>
            <p>Are you an intern, or not sure how to create a Concept? Then please read our documentation.</p>
          </div>
        </div>
        <CreateConceptBox
          concepts={concepts}
          finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
          levelNumber={2}
        />
        <CreateConceptBox
          concepts={concepts}
          finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
          levelNumber={1}
        />
        <CreateConceptBox
          concepts={concepts}
          finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
          levelNumber={0}
        />
      </div>
    )
  }
  /* eslint-enable react/jsx-no-bind */

  renderEditSuccessBanner() {
    const { showSuccessBanner, } = this.state
    if (!showSuccessBanner) { return }
    return <div className="success-banner"><span>You saved a concept.</span><span onClick={this.handleClickCloseEditSuccessBanner}><i className="fas fa-close" /></span></div>
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
