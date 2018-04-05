import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { sortByLastName, sortFromSQLTimeStamp } from 'modules/sortingMethods';

export default (props) => {
    let columns = [
      {
        Header: 'Name',
        accessor: 'name',
        resizable: false,
        minWidth: 120,
        sortMethod: sortByLastName,
        Cell: row => row.original.name
      }, {
        Header: "Email",
        accessor: 'email',
        resizable: false,
        minWidth: 250,
        Cell: row => row.original.email
      }, {
        Header: "Role",
        accessor: 'role',
        minWidth: 80,
        resizable: false,
        Cell: row => row.original.role
      }, {
        Header: "Premium",
        accessor: 'subscription',
        resizable: false,
        Cell: row => row.original.subscription,
      }, {
        Header: 'Last Sign In',
        accessor: 'last_sign_in',
        resizable: false,
        sortMethod: sortFromSQLTimeStamp,
        Cell: row => row.original.last_sign_in,
      }, {
        Header: "School",
        accessor: 'school',
        resizable: false,
        minWidth: 90,
        Cell: (row) => {
          if (row.original.school) {
            return <a href={`http://localhost:3000/cms/schools/${row.original.school_id}`}>{row.original.school}</a>
          }
          return 'N/A';
        }
      }, {
        Header: "Edit",
        accessor: 'edit',
        resizable: false,
        minWidth: 40,
        Cell: (row) => {
            return <a href={`http://localhost:3000/cms/users/${row.original.id}/edit`}>Edit</a>
          }
        }, {
        Header: "Details",
        accessor: 'details',
        resizable: false,
        minWidth: 60,
        Cell: (row) => {
            return <a href={`http://localhost:3000/cms/users/${row.original.id}`}>Details</a>
          }
        }, {
        Header: "Sign In",
        accessor: 'sign_in',
        resizable: false,
        minWidth: 60,
        Cell: (row) => {
            return <a href={`http://localhost:3000/cms/users/${row.original.id}/sign_in`}>Sign In</a>
          }
      }
    ];

    if (props.userSearchQueryResults && props.userSearchQueryResults.length) {
      return (<div>
        <ReactTable data={props.userSearchQueryResults}
          columns={columns}
          showPagination={true}
          defaultSorted={[{id: 'last_sign_in', desc: true}]}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={100}
          minRows={1}
          className='progress-report activity-scores-table'/>
        </div>)
    } else {
      return <div>No records match your query.</div>
    }
  };
