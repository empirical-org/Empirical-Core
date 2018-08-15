import React from 'react'
import {Row, Col} from 'antd'
import ConceptsList from './ConceptsList'

export default ({concept}) => {
  return (
    <div>
      <h3>{concept.name}</h3>
      <p>{concept.uid}</p>
      
      <Row gutter={16}>
        <Col span={12}><ConceptsList concepts={concept.siblings} title={"Siblings"}/></Col>
        <Col span={12}><ConceptsList concepts={concept.children} title={"Children"}/></Col>
      </Row>
    </div>
  )
  
} 