import * as React from 'react';
import { Table } from 'antd';
import {Link} from 'react-router';
import { Concept } from '../containers/ConceptsIndex';
import moment from 'moment';

interface ConceptsTableProps {
  concepts: Array<Concept>
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

const columns = [
  {
    title: 'Grandparent Name',
    dataIndex: 'grandparentConceptName',
    key: 'grandparentConceptName',
    render: (text, record:ConceptRow) => (<Link to={record.grandparentConceptId}>{text}</Link>),
    sorter:  (a, b) => a.grandparentConceptName.localeCompare(b.grandparentConceptName),
  },
  {
    title: 'Parent Name',
    dataIndex: 'parentConceptName',
    key: 'parentConceptName',
    render: (text, record:ConceptRow) => (<Link to={record.parentConceptId}>{text}</Link>),
    sorter:  (a, b) => a.parentConceptName.localeCompare(b.parentConceptName),
  },
  {
    title: 'Name',
    dataIndex: 'conceptName',
    key: 'conceptName',
    render: (text, record:ConceptRow) => (<Link to={record.conceptId}>{text}</Link>),
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

const ConceptsTable: React.SFC<ConceptsTableProps> = ({concepts}) => {
  const data = prepareData(concepts);
  return (
    <Table 
      columns={columns} 
      dataSource={data}
      size="middle" 
      bordered 
      pagination={{ pageSize: 20 }}
    />
  );
};

export default ConceptsTable;