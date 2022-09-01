import React from 'react';

import { sortTableByLastName, sortTableFromSQLTimeStamp } from 'modules/sortingMethods';
import getAuthToken from '../components/modules/get_auth_token';
import LoadingIndicator from '../components/shared/loading_indicator'
import { ReactTable, } from '../../Shared/index'

export default class CmsUserIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: this.getColumns(),
      data: props.queryResults,
      query: props.query,
      loading: false,
      showAdvanced: false,
    }
  }

  getColumns() {
    return [
      {
        Header: 'Name',
        accessor: 'name',
        resizable: false,
        minWidth: 120,
        sortType: sortTableByLastName,
      }, {
        Header: "Email",
        accessor: 'email',
        resizable: false,
        minWidth: 250,
      }, {
        Header: "Role",
        accessor: 'role',
        maxWidth: 80,
        resizable: false,
      }, {
        Header: "Premium",
        accessor: 'subscription',
        resizable: false,
      }, {
        Header: 'Last Sign In',
        accessor: 'last_sign_in',
        resizable: false,
        minWidth: 100,
        sortType: sortTableFromSQLTimeStamp,
        Cell: ({row}) => String(row.original.last_sign_in_text)
      }, {
        Header: "School",
        accessor: 'school',
        resizable: false,
        minWidth: 90,
        Cell: ({row}) => {
          if (row.original.school) {
            return <a href={`${process.env.DEFAULT_URL}/cms/schools/${row.original.school_id}`}>{row.original.school}</a>
          }
          return 'N/A';
        }
      }, {
        Header: "Edit",
        accessor: 'edit',
        resizable: false,
        maxWidth: 40,
        Cell: ({row}) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}/edit`}>Edit</a>
        }
      }, {
        Header: "Details",
        accessor: 'details',
        resizable: false,
        maxWidth: 60,
        Cell: ({row}) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}`}>Details</a>
        }
      }, {
        Header: "Sign In",
        accessor: 'sign_in',
        resizable: false,
        maxWidth: 60,
        Cell: ({row}) => {
          return <a href={`${process.env.DEFAULT_URL}/cms/users/${row.original.id}/sign_in`}>Sign In</a>
        }
      }
    ];
  }

  setSort = newSorted => {
    if (!newSorted.length) { return }

    const sort = newSorted[0].id
    const sort_direction = newSorted[0].desc ? 'desc' : 'asc'
    if (sort !== this.state.query.sort || sort_direction !== this.state.query.sort_direction) {
      const newState = { ...this.state}
      newState.query.sort = sort
      newState.query.sort_direction = sort_direction
      this.setState(newState, this.search)
    }
  };

  toggleAdvanced = () => { this.setState(prevState => ({ showAdvanced: !prevState.showAdvanced }))};

  search = (e) => {
    e ? e.preventDefault() : null;
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

  updatePremiumStatus = e => {
    const selectedOptions = []
    Array.from(e.target.options).forEach(o => {
      if (o.selected) {
        selectedOptions.push(o.value)
      }
    })
    const newState = { ...this.state }
    newState.query.user_premium_status = selectedOptions
    this.setState(newState)
  };

  renderPageSelector() {
    const currentPage = this.state.query.page || 1
    const totalPages = this.state.numberOfPages || 1
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

  renderPremiumStatusSelect() {
    const options = this.props.schoolPremiumTypes.map(o => <option value={o}>{o}</option>)
    return (
      <select multiple={true} onChange={this.updatePremiumStatus}>
        {options}
      </select>
    )
  }

  renderTableOrLoading() {
    if (this.state.loading) {
      return <LoadingIndicator />
    } else if (this.state.data && this.state.data.length) {
      const sort = this.state.query.sort ? this.state.query.sort : 'last_sign_in'
      const sortDescending = this.state.query.sort_direction ? this.state.query.sort_direction === 'desc' : true
      return (
        <div>
          <ReactTable
            className='progress-report activity-scores-table'
            columns={this.state.columns}
            data={this.state.data}
            defaultPageSize={100}
            defaultSorted={[{id: sort, desc: sortDescending}]}
            manualSortBy={true}
            minRows={1}
            onSortedChange={this.setSort}
          />
          <div className='cms-pagination-container'>
            {this.renderPageSelector()}
          </div>
        </div>
      )
    } else if (this.state.numberOfPages === 0) {
      return <p>No records found.</p>
    }

  }

  renderUserFlagsetSelect() {
    const options = this.props.flagsets.map(pair => <option value={pair.value}>{pair.label}</option>)
    return (
      <select onChange={e => this.updateField(e, 'flagset')}>
        {options}
      </select>
    )
  }

  renderUserRoleSelect() {
    const options = [<option value />].concat(this.props.userRoleTypes.map(o => <option value={o}>{o}</option>))
    return (
      <select onChange={e => this.updateField(e, 'user_role')}>
        {options}
      </select>
    )
  }

  render() {
    const showAdvanced = this.state.showAdvanced;
    return (
      <div>
        <form acceptCharset="UTF-8" onSubmit={this.search} >
          <div className='cms-form'>
            <div className='cms-meta-middle'>
              <div className='cms-form-row'>
                <label>Email (Exact match)</label>
                <input id='user_email_exact' name='user_email_exact' onChange={e => this.updateField(e, 'user_email_exact')} value={this.state.query.user_email_exact} />
              </div>
              <div className='cms-form-row'>
                <label>Username</label>
                <input id='user_username' name='user_username' onChange={e => this.updateField(e, 'user_username')} value={this.state.query.user_username} />
              </div>
            </div>

            <div className='cms-meta-right'>
              <div className='cms-form-row'>
                <label>Name</label>
                <input id='user_name' name='user_name' onChange={e => this.updateField(e, 'user_name')} value={this.state.query.user_name} />
              </div>
              <div className='cms-form-row'>
                <label>Class Code</label>
                <input id='class_code' name='class_code' onChange={e => this.updateField(e, 'class_code')} value={this.state.query.class_code} />
              </div>
            </div>
          </div>
          <div className={showAdvanced ? 'cms-form' : 'hide'}>
            <div className='cms-meta-middle'>
              <div className='cms-form-row'>
                <label>School Name</label>
                <input id='school_name' name='school_name' onChange={e => this.updateField(e, 'school_name')} value={this.state.query.school_name} />
              </div>

              <div className='cms-form-row'>
                <label>Ip</label>
                <input id='user_ip' name='user_ip' onChange={e => this.updateField(e, 'user_ip')} value={this.state.query.user_ip} />
              </div>

              <div className='cms-form-row'>
                <label>Flagset</label>
                {this.renderUserFlagsetSelect()}
              </div>
              <div className='cms-form-row'>
                <label>Role</label>
                {this.renderUserRoleSelect()}
              </div>
            </div>
            <div className='cms-meta-right'>
              <div className='cms-form-row'>
                <label>Email (Partial match)</label>
                <input id='user_email' name='user_email' onChange={e => this.updateField(e, 'user_email')} value={this.state.query.user_email} />
              </div>
              <div className='cms-form-row'>
                <label>Premium Status</label>
                {this.renderPremiumStatusSelect()}
              </div>
            </div>
          </div>
          <div className='cms-form'>
            <div className='cms-meta-middle'>
              <p>
                <a className="link-green" onClick={this.toggleAdvanced}>{showAdvanced ? 'Hide' : 'Show'} Advanced Search</a>
              </p>
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
