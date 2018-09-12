import React from 'react';
import {Tag} from 'antd';
import {Concept} from '../containers/ConceptsIndex'

export interface ConceptShowProps {
  concept: Concept
}

const ArchivedTag: React.SFC<ConceptShowProps> = ({concept}) => {
  return !concept.visible ? (<Tag>Archived</Tag>) : null
} 

export default ArchivedTag