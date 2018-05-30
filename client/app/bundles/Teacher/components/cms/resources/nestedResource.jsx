import React from 'react'
import NewNestedResource from './newNestedResource.jsx'
import CmsIndexTable from '../cms_index_table/cms_index_table.jsx'

export default React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    /*
    data: {
      name: 'admins',
      formFields: [{name: 'email'}],
      identifier: ['email']
      resources: [{id: 1, email: 'hello@gmail.com'}],
      findOrCreate: 'find'
    }

    */
    actions: React.PropTypes.object.isRequired
    /*
    actions: {
      save: fn,
      delete: fn
    }
    */
  },

  delete: function (resource) {
    this.props.actions.delete(this.props.data.name, resource)
  },

  render: function () {

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
              <NewNestedResource data={this.props.data} actions={this.props.actions} />
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <CmsIndexTable
                data={{resources: this.props.data.resources, identifier: this.props.data.identifier}}
                actions={{delete: this.delete}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
