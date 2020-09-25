import * as React from 'react';
import { Table } from 'antd';
import { firstBy } from "thenby";
import moment from 'moment';

import { Concept } from '../containers/ConceptsIndex';

interface ConceptsTableProps {
  concepts: Array<Concept>
  visible: Boolean,
  selectConcept: Function;
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
      sorter: firstBy<ConceptRow>('grandparentConceptName').thenBy('parentConceptName').thenBy('conceptName'),
    },
    {
      title: 'Level 1',
      dataIndex: 'parentConceptName',
      key: 'parentConceptName',
      render: (text, record:ConceptRow) => (<div onClick={() => selectConcept(record.parentConceptId, 1)}>{text}</div>),
      sorter: firstBy<ConceptRow>('parentConceptName').thenBy('conceptName'),
    },
    {
      title: 'Level 0',
      dataIndex: 'conceptName',
      key: 'conceptName',
      render: (text, record:ConceptRow) => (<div onClick={() => selectConcept(record.conceptId, 0)}>{text}</div>),
      sorter: firstBy('conceptName'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => moment(text* 1000).format('M/D/YY'),
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
  return concepts.filter(concept => concept.visible === visible && concept.parent && concept.parent.parent)
}

const ConceptsTable: React.SFC<ConceptsTableProps> = ({concepts, visible, selectConcept}) => {
  const data = prepareData(filterData(concepts, visible));
  return (
    <Table
      bordered
      className="concepts-table"
      columns={columns(selectConcept)}
      dataSource={data}
      pagination={false}
      size="middle"
    />
  );
};

export default ConceptsTable;
