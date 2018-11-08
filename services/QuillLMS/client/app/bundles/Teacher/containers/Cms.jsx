import React from 'react'
import request from 'request'
import CmsIndexTable from '../components/cms/cms_index_table/cms_index_table.jsx'
import Server from '../components/modules/server/server'
import getAuthToken from '../components/modules/get_auth_token'


export default React.createClass({

  propTypes: {
    resourceNameSingular: React.PropTypes.string.isRequired,
    resourceNamePlural: React.PropTypes.string.isRequired
  },

  initializeModules: function () {
    var server = new Server(this.props.resourceNameSingular, this.props.resourceNamePlural);
    this.modules = {
      server: server
    }
  },

  // TODO: abstract out below method
  updateState: function (key, value) {
    var newState = this.state;
    newState[key] = value;
    this.setState(newState);
  },

  getInitialState: function () {
    this.initializeModules()
    var hash1 = {
      crudState: 'index',
      resourceToEdit: null
    };
    hash1[this.props.resourceNamePlural] = [];
    return hash1;
  },

  indexUrl: function () {
    return ['/cms/', this.props.resourceNamePlural].join('');
  },

  componentDidMount: function () {
    this.getIndexFromServer();
  },

  getIndexFromServer: function () {
    this.modules.server.getStateFromServer(this.props.resourceNamePlural, this.indexUrl(), this.populateResources);
  },

  serializeRecievedData: function (data) {
    let includedObj = {};
    let x;
    for (x = 0; x < data.included.length; x++) {
      includedObj[data.included[x].type + data.included[x].id] = data.included[x];
    }
    let actOrTopicObj;
    for (x = 0; x < data.included.length; x++) {
      if (data.included[x].type == 'activities') {
        actOrTopicObj = data.included[x].attributes;
        actOrTopicObj.topic = includedObj[data.included[x].relationships.topic.type + data.included[x].relationships.topic.id].attributes;
        actOrTopicObj.classification = includedObj[data.included[x].relationships.classification.type + data.included[x].relationships.classification.id].attributes;;
        includedObj[data.included[x].type + data.included[x].id] = actOrTopicObj;
      } else if (data.included[x].type == 'topics') {
        actOrTopicObj = data.included[x].attributes;
        actOrTopicObj.section = includedObj[data.included[x].relationships.section.type + data.included[x].relationships.section.id].attributes;
        actOrTopicObj.topic_category = includedObj[data.included[x].relationships.topic_category.type + data.included[x].relationships.topic_category.id].attributes;
        includedObj[data.included[x].type + data.included[x].id] = actOrTopicObj;
      } else {
        includedObj[data.included[x].type + data.included[x].id] = data.included[x].attributes;
      }
    }

    let newData = [];
    let newObj;
    let i;
    for (i = 0; i < data.data.length; i++) {
      console.log(data.data[i]);
      newObj = {
        name:data.data[i].attributes.name,
        unit_template_category: data.data[i].attributes.unit_template_category,
        time: data.data[i].attributes.time,
        grades:  data.data[i].attributes.grades,
        author_id: data.data[i].attributes.author_id,
        flag: data.data[i].attributes.flag,
        order_number: data.data[i].attributes.order_number,
        activity_info:  data.data[i].attributes.activity_info,
        activities: data.data[i].relationships.activities.map(
          function (rel) {
            let result = includedObj[rel.type + rel.id];
            result.topic = includedObj[
            return includedObj[rel.type + rel.id] 
          }
        )

      };
      //data.data[i].name, data.data[i].unit_template_category, data.data[i].time, data.data[i].grades,
      //data.data[i].author_id, data.data[i].flag, data.data[i].order_number, data.data[i].activity_info,
      newData.push(newObj);
    }
    console.log('data');
    console.log(newData);
    //return newData; // array
  },

  populateResources: function (resource) {
    // FIXME this fn does not have to be so complicated, need to change server module
    let that = this;
    return function (data) {
      that.serializeRecievedData(data);
      var newState = that.state;
      newState[that.props.resourceNamePlural] = data[that.props.resourceNamePlural];
      that.setState(newState);
    }
  },

  indexTable: function () {
    return (
      <span>
        <div className='row'>
          <div className='col-xs-12'>
            <button className='button-green button-top' onClick={this.crudNew}>New</button>
            {this.renderSaveButton()}
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <CmsIndexTable data={{resources: this.state[this.props.resourceNamePlural] }}
                              actions={{edit: this.edit, delete: this.delete}}
                              isSortable={this.isSortable()}
                              updateOrder={this.updateOrder}
                              resourceNameSingular={this.props.resourceNameSingular}
                            />
          </div>
        </div>
      </span>
    );
  },

  returnToIndex: function () {
    this.getIndexFromServer();
    this.setState({crudState: 'index'});
  },

  individualResourceMode: function () {
    return (this.props.resourceComponentGenerator(this));
  },

  edit: function (resource) {
    this.setState({crudState: 'edit', resourceToEdit: resource});
  },

  delete: function (resource) {
    this.modules.server.cmsDestroy(resource.id);
    this.getIndexFromServer();
  },

  crudNew: function () {
    this.setState({crudState: 'new', resourceToEdit: {}});
  },

  updateOrder: function (sortInfo) {
    if(this.isSortable()) {
      const originalOrder = this.state[this.props.resourceNamePlural];
      const newOrder = sortInfo.data.items.map(item => item.key);
      const newOrderedResources = newOrder.map((key, i) => {
        const newResource = originalOrder[key];
        newResource.order_number = i;
        return newResource;
      });
      this.setState({[this.props.resourceNamePlural]: newOrderedResources});
    }
  },

  saveOrder: function () {
    if(this.isSortable()) {
      const resourceName = this.props.resourceNamePlural;
      const that = this;
      request.put(`${process.env.DEFAULT_URL}/cms/${resourceName}/update_order_numbers`, {
        json: {
          [resourceName]: that.state[resourceName],
          authenticity_token: getAuthToken()
        }}, (e, r, response) => {
          if (e) {
            console.log(e);
            alert(`We could not save the updated order. Here is the error: ${e}`);
          } else {
            that.setState({[resourceName]: response[resourceName]});
            alert('The updated order has been saved.');
          }
      })
    }
  },

  renderSaveButton: function () {
    return this.isSortable() ? <button className='button-green button-top save-button' onClick={this.saveOrder}>Save Order</button> : null
  },

  isSortable: function () {
    if(this.state[this.props.resourceNamePlural].length == 0) { return false }
    const sortableResources = ['activity_classifications', 'unit_templates'];
    return sortableResources.includes(this.props.resourceNamePlural);
  },

  render: function () {
    var result;
    switch (this.state.crudState) {
      case 'index':
        result = this.indexTable();
        break;
      case 'edit':
        result = this.individualResourceMode();
        break;
      case 'new':
        result = this.individualResourceMode();
        break;
    }

    return result || null;
  }
});
