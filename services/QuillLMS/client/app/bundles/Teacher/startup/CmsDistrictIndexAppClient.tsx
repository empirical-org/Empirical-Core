import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import getAuthToken from '../components/modules/get_auth_token';
import LoadingIndicator from '../components/shared/loading_indicator'

export default class CmsDistrictIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: this.getColumns(),
      data: props.queryResults,
      query: props.query,
      loading: false
    }
  }

  getColumns() {
    return [
      {
        Header: 'Name',
        accessor: 'district_name',
        resizable: false,
        minWidth: 190,
        Cell: row => row.original.district_name
      }, {
        Header: "City",
        accessor: 'district_city',
        minWidth: 140,
        resizable: false,
        Cell: row => row.original.district_city
      }, {
        Header: "State",
        accessor: 'district_state',
        resizable: false,
        minWidth: 60,
        Cell: row => row.original.district_state,
      }, {
        Header: 'ZIP',
        accessor: 'district_zip',
        resizable: false,
        minWidth: 60,
        Cell: row => Number(row.original.district_zip),
      }, {
        Header: 'Phone',
        accessor: 'phone',
        resizable: false,
        minWidth: 130,
        Cell: row => row.original.phone,
      }, {
        Header: "NCES ID",
        accessor: 'nces_id',
        resizable: false,
        minWidth: 80,
        Cell: row => row.original.nces_id
      }, {
        Header: "Schools",
        accessor: 'total_schools',
        resizable: false,
        minWidth: 80,
        Cell: row => Number(row.original.total_schools),
      }, {
        Header: "Students",
        accessor: 'total_students',
        resizable: false,
        minWidth: 80,
        Cell: row => Number(row.original.total_students),
      }, {
        Header: "Edit",
        accessor: 'edit',
        resizable: false,
        minWidth: 60,
        Cell: (row) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/districts/${row.original.id}`}>Edit</a>
        }
      }
    ];
  }

  setSort = newSorted => {
    const { query } = this.state

    const sort = newSorted[0].id
    const sort_direction = newSorted[0].desc ? 'desc' : 'asc'
    if (sort !== query.sort || sort_direction !== query.sort_direction) {
      const newState = { ...this.state}
      newState.query.sort = sort
      newState.query.sort_direction = sort_direction
      this.setState(newState, this.search)
    }
  };

  search = (e) => {
    const { query } = this.state

    e ? e.preventDefault() : null
    this.setState({loading: true})
    const link = `${process.env.DEFAULT_URL}/cms/districts/search`
    const data = new FormData();
    Object.keys(query).forEach((k) => {
      data.append(k, query[k])
    })
    fetch(link, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: data,
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      this.setState({ data: response.districtSearchQueryResults, numberOfPages: response.numberOfPages, loading: false })
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  };

  submitPageForm = e => {
    this.updatePage(e.target.page.value)
  };

  updateField(e, key) {
    const value = e.target.value
    const newState = { ...this.state}
    newState.query[key] = value
    this.setState(newState)
  }

  updatePage = i => {
    const newState = { ...this.state}
    newState.query.page = i
    this.setState(newState, this.search)
  };

  renderPageSelector() {
    const { query, numberOfPages } = this.state

    const currentPage = query.page || 1
    const totalPages = numberOfPages || 1
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <a onClick={() => this.updatePage(1)}>First</a>
        <form onSubmit={this.submitPageForm}>
          <input defaultValue={currentPage} name='page' /><span>of {totalPages}</span>
        </form>
        <a onClick={() => this.updatePage(totalPages)}>Last</a>
      </div>
    )
  }

  renderTableOrLoading() {
    const { loading, data, columns } = this.state

    if (loading) {
      return <LoadingIndicator />
    } else if (data && data.length) {
      const sort = query.sort ? query.sort : 'number_teachers'
      const sortDescending = query.sort_direction ? query.sort_direction === 'desc' : true
      return (
        <div>
          <ReactTable
            className='progress-report activity-scores-table'
            columns={columns}
            data={data}
            defaultPageSize={100}
            defaultSorted={[{id: sort, desc: sortDescending}]}
            minRows={1}
            onSortedChange={this.setSort}
            showPageSizeOptions={false}
            showPagination={false}
            showPaginationBottom={false}
            showPaginationTop={false}
          />
          <div className='cms-pagination-container'>
            {this.renderPageSelector()}
          </div>
        </div>
      )
    } else {
      return <p>No records found for your query.</p>
    }
  }

  render() {
    const { query } = this.state

    return (
      <div>
        <form acceptCharset="UTF-8" onSubmit={this.search} >
          <div className='cms-form districts-form'>
            <div className='cms-meta-middle districts-meta-middle'>
              <div className='cms-form-row'>
                <label>District Name</label>
                <input id='district_name' name='district_name' onChange={e => this.updateField(e, 'district_name')} value={query.district_name} />
              </div>

              <div className='cms-form-row'>
                <label>City</label>
                <input id='district_city' name='district_city' onChange={e => this.updateField(e, 'district_city')} value={query.district_city} />
              </div>

              <div className='cms-form-row'>
                <label>State</label>
                <input id='district_state' name='district_state' onChange={e => this.updateField(e, 'district_state')} value={query.district_state} />
              </div>

              <div className='cms-form-row'>
                <label>Zip</label>
                <input id='district_zip' name='district_zip' onChange={e => this.updateField(e, 'district_zip')} value={query.district_zip} />
              </div>

              <div className='cms-form-row'>
                <label>NCES ID</label>
                <input id='nces_id' name='nces_id' onChange={e => this.updateField(e, 'nces_id')} value={query.nces_id} />
              </div>
            </div>

            <div className='cms-meta-right districts-meta-right'>
              <div className='cms-submit-row'>
                <input type="submit" value="Submit" />
              </div>
            </div>
          </div>
        </form>
        {this.renderTableOrLoading()}
      </div>
    )
  }
}
