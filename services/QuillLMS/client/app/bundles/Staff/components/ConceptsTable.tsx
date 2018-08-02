import * as React from 'react';
import { Table } from 'antd';
import { Concept } from '../containers/ConceptsIndex';


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
}

const columns = [
  {
    title: 'Grandparent Name',
    dataIndex: 'grandparentConceptName',
    key: 'grandparentConceptName',
    render: (text, record:ConceptRow) => (<a href={"/cms/concepts/" + record.grandparentConceptId}>{text}</a>),
    sorter:  (a, b) => a.grandparentConceptName.localeCompare(b.grandparentConceptName),
  },
  {
    title: 'Parent Name',
    dataIndex: 'parentConceptName',
    key: 'parentConceptName',
    render: (text, record:ConceptRow) => (<a href={"/cms/concepts/" + record.parentConceptId}>{text}</a>),
    sorter:  (a, b) => a.parentConceptName.localeCompare(b.parentConceptName),
  },
  {
    title: 'Name',
    dataIndex: 'conceptName',
    key: 'conceptName',
    render: (text, record:ConceptRow) => (<a href={"/cms/concepts/" + record.conceptId}>{text}</a>),
    sorter:  (a, b) => a.conceptName.localeCompare(b.conceptName),
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
    />
  );
};

export default ConceptsTable;