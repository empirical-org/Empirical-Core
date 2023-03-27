import React from 'react';

import { requestPut } from '../../../modules/request/index';
import CmsIndexTable from '../components/cms/cms_index_table/cms_index_table.jsx';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown';
import Server from '../components/modules/server/server';

export default class Cms extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.initializeModules()
    let hash1 = {
      crudState: 'index',
      resourceToEdit: null,
      flag: 'All'
    };
    hash1[props.resourceNamePlural] = [];
    this.state = hash1;
  }

  componentDidMount() {
    this.getIndexFromServer();
  }

  initializeModules = () => {
    let server = new Server(this.props.resourceNameSingular, this.props.resourceNamePlural);
    this.modules = {
      server: server
    }
  };

  // TODO: abstract out below method
  updateState = (key, value) => {
    let newState = this.state;
    newState[key] = value;
    this.setState(newState);
  };

  indexUrl = () => {
    return ['/cms/', this.props.resourceNamePlural].join('');
  };

  getIndexFromServer = () => {
    this.modules.server.getStateFromServer(this.props.resourceNamePlural, this.indexUrl(), this.populateResources);
  };

  populateResources = (resource) => {
    // FIXME this fn does not have to be so complicated, need to change server module
    let that = this;
    return function (data) {
      let newState = that.state;
      newState[that.props.resourceNamePlural] = data[that.props.resourceNamePlural];
      that.setState(newState);
    }
  };

  indexTable = () => {
    const resourceName = this.props.resourceNamePlural
    let resources
    if (resourceName === 'unit_templates' && this.state.flag !== 'All') {
      if (this.state.flag === 'Not Archived') {
        resources = this.state[resourceName].filter(resource => resource.flag !== 'archived')
      } else {
        resources = this.state[resourceName].filter(resource => resource.flag === this.state.flag.toLowerCase())
      }
    } else {
      resources = this.state[resourceName]
    }
    return (
      <span>
        <div className='row'>
          <div className='col-xs-12'>
            <button className='button-green button-top' onClick={this.crudNew}>New</button>
            {this.renderSaveButton()}
            {this.renderFlagDropdown()}
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <CmsIndexTable
              actions={{edit: this.edit, delete: this.delete}}
              data={{ resources, }}
              isSortable={this.isSortable()}
              resourceNameSingular={this.props.resourceNameSingular}
              updateOrder={this.updateOrder}
            />
          </div>
        </div>
      </span>
    );
  };

  returnToIndex = () => {
    this.getIndexFromServer();
    this.setState({crudState: 'index'});
  };

  individualResourceMode = () => {
    return (this.props.resourceComponentGenerator(this));
  };

  edit = (resource) => {
    const { resourceNamePlural } = this.props
    window.open(`/cms/${resourceNamePlural}/${resource.id}/edit`)
  };

  delete = (resource) => {
    this.modules.server.cmsDestroy(resource.id);
    this.getIndexFromServer();
  };

  crudNew = () => {
    this.setState({crudState: 'new', resourceToEdit: {}});
  };

  updateOrder = (sortInfo) => {
    if(this.isSortable()) {
      let originalOrder = this.state[this.props.resourceNamePlural]
      if (this.state.flag === 'Not Archived') {
        originalOrder = originalOrder.filter(resource => resource.flag !== 'archived')
      }
      const newOrder = sortInfo.map(item => item.key);
      const newOrderedResources = newOrder.map((key, i) => {
        const newResource = originalOrder[key];
        newResource.order_number = i;
        return newResource;
      });
      this.setState({[this.props.resourceNamePlural]: newOrderedResources});
    }
  };

  saveOrder = () => {
    if(this.isSortable()) {
      const resourceName = this.props.resourceNamePlural;
      const that = this;
      requestPut(
        `${import.meta.env.VITE_DEFAULT_URL}/cms/${resourceName}/update_order_numbers`,
        { [resourceName]: that.state[resourceName], },
        (body) => {
          that.setState({[resourceName]: body[resourceName]});
          alert('The updated order has been saved.');
        },
        (body) => {
          alert(`We could not save the updated order. Here is the error: ${body}`);
        },
      )
    }
  };

  renderSaveButton = () => {
    return this.isSortable() ? <button className='button-green button-top save-button' onClick={this.saveOrder}>Save Order</button> : null
  };

  renderFlagDropdown = () => {
    const resourceName = this.props.resourceNamePlural;
    if (resourceName === 'unit_templates') {
      const options = ['All', 'Not Archived', 'Archived', 'Alpha', 'Beta', 'Gamma', 'Production']
      return (
        <div style={{ marginLeft: '10px', display: 'inline', }}>
          <ItemDropdown
            callback={this.switchFlag}
            items={options}
            selectedItem={this.state.flag}
          />
        </div>
      )
    }
  };

  switchFlag = (flag) => {
    this.setState({flag: flag})
  };

  isSortable = () => {
    if(this.state[this.props.resourceNamePlural].length == 0 || (this.state.flag && !['All', 'Not Archived'].includes(this.state.flag))) { return false }
    const sortableResources = ['activity_classifications', 'unit_templates'];
    return sortableResources.includes(this.props.resourceNamePlural);
  };

  render() {
    let result;
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
}
