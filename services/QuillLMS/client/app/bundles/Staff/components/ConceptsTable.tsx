import * as React from 'react';
import { Table } from 'antd';
import {div} from 'react-router';
import { Concept } from '../containers/ConceptsIndex';
import moment from 'moment';
import _ from 'lodash';

interface ConceptsTableProps {
  concepts: Array<Concept>
  visible: Boolean
}

interface ConceptRow {
  key: string;
  conceptName:string;
  parentConceptName:string;
  grandparentConceptName:string;
  conceptId:string;
  parentConceptId:string|null;
  grandparentConceptId:string|null;
  createdAt:number;
}

function columns(selectConcept) {
  return [
    {
      title: 'Level 2',
      dataIndex: 'grandparentConceptName',
      key: 'grandparentConceptName',
      render: (text, record:ConceptRow) => (<div onClick={() => selectConcept(record.grandparentConceptId, 2)}>{text}</div>),
      sorter:  (a, b) => a.grandparentConceptName.localeCompare(b.grandparentConceptName),
    },
    {
      title: 'Level 1',
      dataIndex: 'parentConceptName',
      key: 'parentConceptName',
      render: (text, record:ConceptRow) => (<div onClick={() => selectConcept(record.parentConceptId, 1)}>{text}</div>),
      sorter:  (a, b) => a.parentConceptName.localeCompare(b.parentConceptName),
    },
    {
      title: 'Level 0',
      dataIndex: 'conceptName',
      key: 'conceptName',
      render: (text, record:ConceptRow) => (<div onClick={() => selectConcept(record.conceptId, 0)}>{text}</div>),
      sorter:  (a, b) => a.conceptName.localeCompare(b.conceptName),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text* 1000).format('MMMM Do YYYY'),
      sorter:  (a, b) => (a.createdAt - b.createdAt),
    },
  ];
}

function prepareData(data:Array<Concept>):Array<ConceptRow> {
  return data.map((concept:Concept) => prepareRow(concept));
}

function prepareRow(concept:Concept):ConceptRow {
  return {
    key: concept.id,
    conceptName: concept.name,
    conceptId: concept.id,
    parentConceptName: concept.parent ? concept.parent.name : "",
    parentConceptId: concept.parent ? concept.parent.id : null,
    grandparentConceptName: concept.parent && concept.parent.parent ? concept.parent.parent.name : "",
    grandparentConceptId: concept.parent && concept.parent.parent ? concept.parent.parent.id : null,
    createdAt: concept.createdAt,
  }
}

function filterData(concepts:Array<Concept>, visible:Boolean):Array<Concept> {
  return concepts.filter(concept => concept.visible == visible)
}

const ConceptsTable: React.SFC<ConceptsTableProps> = ({concepts, visible, selectConcept}) => {
  const data = prepareData(filterData(concepts, visible));
  return (
    <Table
      columns={columns(selectConcept)}
      dataSource={data}
      size="middle"
      bordered
      pagination={false}
      className="concepts-table"
    />
  );
};

export default ConceptsTable;
