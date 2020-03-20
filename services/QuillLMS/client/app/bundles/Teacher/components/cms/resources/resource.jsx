import PropTypes from 'prop-types';
import React from 'react'
import TextInputGenerator from '../../modules/componentGenerators/text_input_generator.jsx'
import Server from '../../modules/server/server.jsx';
import NestedResource from '../../modules/nested_resource.jsx'
import CmsNestedResource from './nestedResource.jsx'
export default class extends React.Component {
  static propTypes = {
    resourceNameSingular: PropTypes.string.isRequired,
    resourceNamePlural: PropTypes.string.isRequired,
    initialModel: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    formFields: PropTypes.array.isRequired,
    returnToIndex: PropTypes.func.isRequired,
    savingKeys: PropTypes.array.isRequired,
    nestedResources: PropTypes.array,
    fieldsToNormalize: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.initializeModules();
    var model1 = _.extend(props.initialModel, props.resource);

    var hash = {
      model: model1
    };
    this.state = hash;
  }

  initializeModules = () => {
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

  };

  updateModelState = (key, value) => {
    var newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  };

  addNestedResource = (kind, resource) => {
    var newModel = this.modules.nestedResources[kind].add(resource)
    this.nestedResourceSaveHelper(newModel)
  };

  removeNestedResourceAndSave = (kind, resource) => {
    var newModel = this.modules.nestedResources[kind].remove(resource)
    this.nestedResourceSaveHelper(newModel)
  };

  nestedResourceSaveHelper = (newModel) => {
    var data = _.pick(newModel, this.props.savingKeys)
    var options = {
      callback: this.updateModelSaveCallback,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options)
  };

  updateModelSaveCallback = (data) => {
    this.setState({model: data[this.props.resourceNameSingular]})
  };

  save = () => {
    var data = _.pick(this.state.model, this.props.savingKeys);
    var options = {
      callback: this.props.returnToIndex,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options);
  };

  render() {
    var inputs = this.modules.textInputGenerator.generate(this.props.formFields);
    let nestedResources
    if (this.props.nestedResources) {
      nestedResources = this.props.nestedResources.map((nr, index)=>{
        var resources = this.state.model[nr.name];
        var data = _.extend(nr, {resources: resources});
        return <CmsNestedResource actions={{save: this.addNestedResource, delete: this.removeNestedResourceAndSave}} data={data} key={index} />;
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
              <button className='button-green pull-left' onClick={this.save}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
