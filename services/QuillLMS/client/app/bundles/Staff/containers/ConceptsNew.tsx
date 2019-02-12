import * as React from "react";
import {Link} from "react-router";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import ConceptManagerNav from "../components/ConceptManagerNav";
import ConceptBoxContainer from "../components/ConceptBoxContainer"
import CreateConceptBox from "../components/CreateConceptBox"
import ConceptLevels from "../components/ConceptLevels";

import {
  Breadcrumb, Divider, Form, Input, Cascader, Button
} from "antd";
import { CascaderOptionType } from "../../../../node_modules/antd/lib/cascader";

const FormItem = Form.Item;

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
      }
      children {
        id
        name
      }
    }
  }
`

class AddConcept extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      selectedConcept: {},
      showEditSuccessBanner: false
    }

    this.selectConcept = this.selectConcept.bind(this)
    this.finishEditingOrCreatingConcept = this.finishEditingOrCreatingConcept.bind(this)
    this.closeEditSuccessBanner = this.closeEditSuccessBanner.bind(this)
  }

  selectConcept(conceptID, levelNumber) {
    this.setState({ selectedConcept: { conceptID, levelNumber }})
  }

  finishEditingOrCreatingConcept(refetch) {
    this.setState({ showEditSuccessBanner: true, selectedConcept: {} }, () => refetch())
  }

  closeEditSuccessBanner() {
    this.setState({ showEditSuccessBanner: false })
  }

  renderContent() {
    return <Query
      query={gql(allConceptsQuery)}
    >
    {({ loading, error, data, refetch, networkStatus }) => {
        if (networkStatus === 4) return <p>Refetching!</p>;
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error :(</p>;
        const concepts:CascaderOptionType[] = data.concepts;
        return <div className="concept-levels-and-forms-container">
          <ConceptLevels
            concepts={concepts}
            selectConcept={this.selectConcept}
          />
          {this.renderConceptForms(refetch)}
        </div>
      }}
    </Query>
  }

  renderConceptForms(refetch) {
    const { conceptID, levelNumber } = this.state.selectedConcept
    if (conceptID && (levelNumber || levelNumber === 0)) {
      return <ConceptBoxContainer
        conceptID={conceptID}
        levelNumber={levelNumber}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
    } else {
      return this.renderAddNewConceptsForms(refetch)
    }
  }

  renderAddNewConceptsForms(refetch) {
    return <div className="new-concept-forms">
      <CreateConceptBox
        levelNumber={2}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
      <CreateConceptBox
        levelNumber={1}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
      <CreateConceptBox
        levelNumber={0}
        finishEditingOrCreatingConcept={() => this.finishEditingOrCreatingConcept(refetch)}
      />
    </div>
  }

  renderEditSuccessBanner() {
    if (this.state.showEditSuccessBanner) {
      return <div className="success-banner"><span>You saved a concept.</span><i className="fa fa-close" onClick={this.closeEditSuccessBanner}/></div>
    }
  }

  // handleFormChange = (changedFields) => {
  //   console.log(changedFields)
  //   this.setState(({ fields }) => {
  //     const newState =  {
  //       fields: { ...fields, ...changedFields },
  //     }
  //     console.log("new: ", newState)
  //     return newState;
  //   });
  // }
  //
  // handleFormSubmit = (e) => {
  //   e.preventDefault()
  //   console.log('submitting', this.state);
  // }
  //
  // redirectToShow = (data) => {
  //   console.log("Called")
  //   this.props.router.push(data.createConcept.concept.id)
  // }

  // render() {
  //   const fields = this.state.fields;
  //   return  (
  //     <div>
  //       <ConceptManagerNav />
  //       <Divider></Divider>
  //       <Mutation mutation={CREATE_CONCEPT} onCompleted={this.redirectToShow}>
  //         {(createConcept, { data }) => (
  //           <CustomizedForm {...fields} onChange={this.handleFormChange} onSubmit={(e) => {
  //             e.preventDefault();
  //             createConcept({ variables: {
  //               name: this.state.fields.name.value,
  //               parentId: this.state.fields.parentId.value[this.state.fields.parentId.value.length - 1],
  //               description: this.state.fields.description.value,
  //             }});
  //           }} />
  //         )}
  //       </Mutation>
  //     </div>
  //   )
  // }

  render() {
    // const fields = this.state.fields;
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
