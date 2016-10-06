import React from 'react'
import TextInputGenerator from '../../modules/componentGenerators/text_input_generator.jsx'
import Server from '../../modules/server/server.jsx';
import NestedResource from '../../modules/nested_resource.jsx'
import CmsNestedResource from './nestedResource.jsx'
export default React.createClass({
  propTypes: {
    resourceNameSingular: React.PropTypes.string.isRequired,
    resourceNamePlural: React.PropTypes.string.isRequired,
    initialModel: React.PropTypes.object.isRequired,
    resource: React.PropTypes.object.isRequired,
    formFields: React.PropTypes.array.isRequired,
    returnToIndex: React.PropTypes.func.isRequired,
    savingKeys: React.PropTypes.array.isRequired,
    nestedResources: React.PropTypes.array,
    fieldsToNormalize: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    this.initializeModules();
    var model1 = _.extend(this.props.initialModel, this.props.resource);

    var hash = {
      model: model1
    };
    return hash;
  },

  initializeModules: function () {
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState),
      server: new Server(this.props.resourceNameSingular, this.props.resourceNamePlural, '/cms'),
      nestedResources: []
    };
    let that = this;
    if (this.props.nestedResources) {
      this.props.nestedResources.forEach((nr)=>{
        if (nr.name) {
          that.modules.nestedResources[nr.name] = new NestedResource(that, nr.name);
        }
      });
    }

  },

  updateModelState: function (key, value) {
    var newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  },

  addNestedResource: function (kind, resource) {
    var newModel = this.modules.nestedResources[kind].add(resource)
    this.nestedResourceSaveHelper(newModel)
  },

  removeNestedResourceAndSave: function (kind, resource) {
    var newModel = this.modules.nestedResources[kind].remove(resource)
    this.nestedResourceSaveHelper(newModel)
  },

  nestedResourceSaveHelper: function (newModel) {
    var data = _.pick(newModel, this.props.savingKeys)
    var options = {
      callback: this.updateModelSaveCallback,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options)
  },

  updateModelSaveCallback: function (data) {
    this.setState({model: data[this.props.resourceNameSingular]})
  },

  save: function () {
    var data = _.pick(this.state.model, this.props.savingKeys);
    var options = {
      callback: this.props.returnToIndex,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options);
  },


  render: function () {
    var inputs = this.modules.textInputGenerator.generate(this.props.formFields);
    let nestedResources
    if (this.props.nestedResources) {
      nestedResources = this.props.nestedResources.map((nr, index)=>{
        var resources = this.state.model[nr.name];
        var data = _.extend(nr, {resources: resources});
        return <CmsNestedResource key={index} data={data} actions={{save: this.addNestedResource, delete: this.removeNestedResourceAndSave}} />;
      });
    }
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-12'>
              <a onClick={this.props.returnToIndex}>{['Back to List of', this.props.resourceNamePlural].join(' ')}</a>
            </div>
          </div>
          <br /><br />
          <div className='row'>
            <div className='col-xs-12'>
              <div>{inputs}</div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              {nestedResources}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <button onClick={this.save} className='button-green pull-left'>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
