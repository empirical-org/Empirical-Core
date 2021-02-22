import * as React from 'react';
import ReactTable from 'react-table';
import { firstBy } from "thenby";

import { Concept } from '../containers/ConceptsIndex';
import moment from 'moment';

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
      Header: 'Level 2',
      accessor: 'grandparentConceptName',
      key: 'grandparentConceptName',
      Cell: (props) => (<div onClick={() => selectConcept(props.original.grandparentConceptId, 2)}>{props.original.grandparentConceptName}</div>),
      sortType: firstBy<ConceptRow>('grandparentConceptName').thenBy('parentConceptName').thenBy('conceptName'),
    },
    {
      Header: 'Level 1',
      accessor: 'parentConceptName',
      key: 'parentConceptName',
      Cell: (props) => (<div onClick={() => selectConcept(props.original.parentConceptId, 1)}>{props.original.parentConceptName}</div>),
      sortType: firstBy<ConceptRow>('parentConceptName').thenBy('conceptName'),
    },
    {
      Header: 'Level 0',
      accessor: 'conceptName',
      key: 'conceptName',
      Cell: (props) => (<div onClick={() => selectConcept(props.original.conceptId, 0)}>{props.original.conceptName}</div>),
      sortType: firstBy('conceptName'),
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      key: 'createdAt',
      Cell: (props) => moment(props.original.createdAt* 1000).format('M/D/YY'),
      sortType:  (a, b) => (a.createdAt - b.createdAt),
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
    <ReactTable
      className="concepts-table"
      columns={columns(selectConcept)}
      data={data}
      defaultPageSize={data.length}
      showPagination={false}
    />
  );
};

export default ConceptsTable;
