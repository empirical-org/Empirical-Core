import React from 'react'
import {Button} from 'antd'

import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const EDIT_CONCEPT = gql`
mutation editConcept($id: ID! $visible: Boolean){
    editConcept(input: {id: $id, visible: $visible}){
      concept {
        id
        uid
        name
        parentId
        visible
      }
    }
  }
`;

export interface ConceptArchiveButtonProps {
  id: string
  visible: boolean
}

const ConceptArchiveButton: React.SFC<ConceptArchiveButtonProps> =  ({id, visible}) => {
  return (
    <Mutation mutation={EDIT_CONCEPT}>
      {(editConcept, { data }) => (
        <Button type="default" icon="delete" onClick={(e) => {
          e.preventDefault();
          editConcept({ variables: {id: id, visible: !visible}});
        }}>{visible ? 'Archive' : 'Un-Archive'}</Button>
      )}
    </Mutation>
  )
}

export default ConceptArchiveButton