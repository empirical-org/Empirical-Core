import * as React from 'react';
import moment from 'moment';
import { firstBy } from "thenby";

import { Concept } from '../containers/ConceptsIndex';
import { ReactTable, } from '../../Shared/index';

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
      Cell: ({row}) => (<div onClick={() => selectConcept(row.original.grandparentConceptId, 2)}>{row.original.grandparentConceptName}</div>),
      sortType: firstBy<ConceptRow>(r => r.original.grandparentConceptName).thenBy(r => r.original.parentConceptName).thenBy(r => r.original.conceptName),
    },
    {
      Header: 'Level 1',
      accessor: 'parentConceptName',
      key: 'parentConceptName',
      Cell: ({row}) => (<div onClick={() => selectConcept(row.original.parentConceptId, 1)}>{row.original.parentConceptName}</div>),
      sortType: firstBy<ConceptRow>(r => r.original.parentConceptName).thenBy(r => r.original.conceptName),
    },
    {
      Header: 'Level 0',
      accessor: 'conceptName',
      key: 'conceptName',
      Cell: ({row}) => (<div onClick={() => selectConcept(row.original.conceptId, 0)}>{row.original.conceptName}</div>),
      sortType: firstBy(r => r.original.conceptName),
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      key: 'createdAt',
      Cell: ({row}) => moment(row.original.createdAt* 1000).format('M/D/YY'),
      sortType:  (a, b) => (a.original.createdAt - b.original.createdAt),
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
    />
  );
};

export default ConceptsTable;
