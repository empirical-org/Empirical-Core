import PropTypes from 'prop-types';
import React from 'react'
import NewNestedResource from './newNestedResource.jsx'
import CmsIndexTable from '../cms_index_table/cms_index_table.jsx'

export default class extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    /*
    data: {
      name: 'admins',
      formFields: [{name: 'email'}],
      identifier: ['email']
      resources: [{id: 1, email: 'hello@gmail.com'}],
      findOrCreate: 'find'
    }

    */
    actions: PropTypes.object.isRequired
    /*
    actions: {
      save: fn,
      delete: fn
    }
    */
  };

  delete = (resource) => {
    this.props.actions.delete(this.props.data.name, resource)
  };

  render() {

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <br /><br />
          <div className='row'>
            <div className='col-xs-12'>
              <h3>{this.props.data.name}</h3>
              <br />
              <p>{this.props.data.message}</p>
            </div>
          </div>
          <br /><br />
          <div className='row'>
            <div className='col-xs-12'>
              <NewNestedResource actions={this.props.actions} data={this.props.data} />
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <CmsIndexTable
                actions={{delete: this.delete}}
                data={{resources: this.props.data.resources, identifier: this.props.data.identifier}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
