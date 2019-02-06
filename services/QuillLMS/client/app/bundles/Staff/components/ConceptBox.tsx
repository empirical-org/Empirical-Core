import * as React from "react";
import {Link} from "react-router";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import client from '../../../modules/apollo';
import Input from '../../Teacher/components/shared/input'
import DropdownInput from '../../Teacher/components/shared/dropdown_input'
import {
  Breadcrumb,
  Divider,
  Card,
  List,
  Row,
  Col,
} from "antd";
import ConceptsShow from "../components/ConceptsShow";
import ConceptBreadCrumb from '../components/ConceptBreadCrumb';
import ItemDropdown from '../../Teacher/components/general_components/dropdown_selectors/item_dropdown'

function levelTwoConceptsQuery(){
  return `
  {
    concepts(levelTwoOnly: true) {
      value: id
      label: name
    }
  }
`
}

const EDIT_CONCEPT = gql`
mutation editConcept($id: ID! $name: String, $parentId: ID, $description: String){
    editConcept(input: {id: $id, name: $name, parentId: $parentId, description: $description}){
      concept {
        id
        uid
        name
        description
        parentId
        visible
      }
    }
  }
`;

function conceptQuery(id){
  return `
  {
    concept(id: ${id}) {
      id
      uid
      name
      description
      visible
      replacementId
      parent {
        id
        name
        parent {
          id
          name
          children {
            id
            name
          }
        }
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

class ConceptBox extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      concept: props.concept,
      originalConcept: props.concept
    }
  }

  renderLevels() {
    const { concept } = this.state
    if (this.props.levelNumber === 2) {
      return <div>
        <Input
          label='Level 2'
          value={concept.name}
          type='text'
        />
      </div>
    } else if (this.props.levelNumber === 1) {
      return <div>
        <Input
          label='Level 2'
          value={concept.parent.parent.name}
          type='text'
        />
        <DropdownInput
          label='Level 1'
        />
        <Input
          label='Level 1'
          value={concept.name}
          type='text'
        />
      </div>
    } else if (this.props.levelNumber === 0) {
      return <div>
        <Input
          disabled={true}
          label='Level 2'
          value={concept.parent.parent.name}
          type='text'
        />
        <DropdownInput
          label='Level 1'
        />
        <Input
          label='Level 0'
          value={concept.name}
          type='text'
        />
      </div>
    }
  }

  render() {
    return  (
      <div className="concept-box">
        <p>Level {this.props.levelNumber}</p>
        <h1>{this.state.concept.name}</h1>
        <p>UID: {this.state.concept.uid}</p>
        {this.renderLevels()}
      </div>
    )
  }

};

export default ConceptBox
