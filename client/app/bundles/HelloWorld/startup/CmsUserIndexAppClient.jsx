import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { sortByLastName, sortFromSQLTimeStamp } from 'modules/sortingMethods';
import getAuthToken from '../components/modules/get_auth_token';
import LoadingIndicator from '../components/shared/loading_indicator'

export default class CmsUserIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: this.getColumns(),
      data: props.queryResults,
      query: props.query,
      loading: false
    }

    this.setSort = this.setSort.bind(this)
    this.search = this.search.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.submitPageForm = this.submitPageForm.bind(this)
  }

  getColumns() {
    return [
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
            return <a href={`${process.env.DEFAULT_URL}/cms/schools/${row.original.school_id}`}>{row.original.school}</a>
          }
          return 'N/A';
        }
      }, {
        Header: "Edit",
        accessor: 'edit',
        resizable: false,
        minWidth: 40,
        Cell: (row) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}/edit`}>Edit</a>
        }
      }, {
        Header: "Details",
        accessor: 'details',
        resizable: false,
        minWidth: 60,
        Cell: (row) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}`}>Details</a>
        }
      }, {
        Header: "Sign In",
        accessor: 'sign_in',
        resizable: false,
        minWidth: 60,
        Cell: (row) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}/sign_in`}>Sign In</a>
        }
      }
    ];
  }

  setSort(newSorted) {
    const sort = newSorted[0].id
    const sort_direction = newSorted[0].desc ? 'desc' : 'asc'
    if (sort !== this.state.query.sort || sort_direction !== this.state.query.sort_direction) {
      const newState = { ...this.state}
      newState.query.sort = sort
      newState.query.sort_direction = sort_direction
      this.setState(newState, this.search)
    }
  }

  updateField(e, key) {
    const value = e.target.value
    const newState = { ...this.state}
    newState.query[key] = value
    this.setState(newState)
  }

  updateUserRole(e) {
    const selectedOptions = e.target.options.filter(o => o.selected)
    const newState = { ...this.state }
    newState.query.user_role = selectedOptions
    this.setState(newState)
  }

  updatePage(i) {
    const newState = { ...this.state}
    newState.query.page = i
    this.setState(newState, this.search)
  }

  renderPremiumStatusSelect() {
    const options = this.props.schoolPremiumTypes.map(o => <option value={o}>{o}</option>)
    return <select multiple={true} onChange={(e) => this.updateField(e, 'user_premium_status')}>
      {options}
    </select>
  }

  renderUserRoleSelect() {
    const options = [<option value></option>].concat(this.props.userRoleTypes.map(o => <option value={o}>{o}</option>))
    return <select onChange={this.updateUserRole}>
      {options}
    </select>
  }

  submitPageForm(e) {
    this.updatePage(e.target.page.value)
  }

  renderPageSelector() {
    const currentPage = this.state.query.page || 1
    const totalPages = this.state.numberOfPages || 1
    return <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <a onClick={() => this.updatePage(1)}>First</a>
      <form onSubmit={this.submitPageForm}>
        <input defaultValue={currentPage} name='page'/><span>of {totalPages}</span>
      </form>
      <a onClick={() => this.updatePage(totalPages)}>Last</a>
    </div>
  }

  search() {
    this.setState({loading: true})
    const link = `${process.env.DEFAULT_URL}/cms/users/search`
    const data = new FormData();
    Object.keys(this.state.query).forEach((k) => {
      data.append(k, this.state.query[k])
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
      this.setState({ data: response.userSearchQueryResults, numberOfPages: response.numberOfPages, loading: false })
    }).catch((error) => {
      console.log('error', error)
    })
  }

  renderTableOrLoading() {
    if (this.state.loading) {
      return <LoadingIndicator/>
    }
    const sort = this.state.query.sort ? this.state.query.sort : 'last_sign_in'
    const sortDescending = this.state.query.sort_direction ? this.state.query.sort_direction === 'desc' : true
    return (<div>
      <ReactTable data={this.state.data}
      columns={this.state.columns}
      showPagination={false}
      defaultSorted={[{id: sort, desc: sortDescending}]}
      showPaginationTop={false}
      showPaginationBottom={false}
      showPageSizeOptions={false}
      defaultPageSize={100}
      minRows={1}
      className='progress-report activity-scores-table'
      onSortedChange={this.setSort}
    />
      <div className='cms-pagination-container'>
        {this.renderPageSelector()}
      </div>
    </div>)

  }

  render() {
    if (this.state.data && this.state.data.length) {
      return (<div>
        <div className='cms-form'>
          <div className='cms-meta-middle'>
            <div className='cms-form-row'>
              <label>Name</label>
              <input id='user_name' name='user_name' value={this.state.query.user_name} onChange={e => this.updateField(e, 'user_name')}/>
            </div>

            <div className='cms-form-row'>
              <label>Username</label>
              <input id='user_username' name='user_username' value={this.state.query.user_username} onChange={e => this.updateField(e, 'user_username')}/>
            </div>

              <div className='cms-form-row'>
              <label>Email</label>
              <input id='user_email' name='user_email' value={this.state.query.user_email} onChange={e => this.updateField(e, 'user_email')}/>
            </div>

              <div className='cms-form-row'>
              <label>Ip</label>
              <input id='user_ip' name='user_ip' value={this.state.query.user_ip} onChange={e => this.updateField(e, 'user_ip')}/>
            </div>

            <div className='cms-form-row'>
              <label>School Name</label>
              <input id='school_name' name='school_name' value={this.state.query.school_name} onChange={e => this.updateField(e, 'school_name')}/>
            </div>
          </div>

          <div className='cms-meta-right'>
            <div className='cms-form-row'>
              <label>Premium Status</label>
              {this.renderPremiumStatusSelect()}
            </div>

            <div className='cms-form-row'>
              <label>Role</label>
              {this.renderUserRoleSelect()}
            </div>

            <div className='cms-submit-row'>
              <input onClick={this.search} type="submit" value="Submit" />
            </div>
          </div>
        </div>
        {this.renderTableOrLoading()}
      </div>
      )
    }
  }
}
