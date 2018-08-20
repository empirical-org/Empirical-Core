import React from 'react';
import {Row, Col, Button} from 'antd';
import {Link} from 'react-router';
import ConceptsList from './ConceptsList';

export default ({concept}) => {
  return (
    <div>
      <h3>{concept.name}</h3>
      <p>{concept.uid}</p>
      <Button.Group>
        <Link to={`${concept.id}/edit`}>
        <Button type="default" icon="edit">Edit</Button>
        </Link>
        
        <Button type="default" icon="delete">Archive</Button>
        <Button type="default" icon="fork">Find & Replace</Button>
      </Button.Group>
      <Row gutter={16}>
        <Col span={12}><ConceptsList concepts={concept.siblings} title={"Siblings"}/></Col>
        <Col span={12}><ConceptsList concepts={concept.children} title={"Children"}/></Col>
      </Row>
    </div>
  )
  
} 