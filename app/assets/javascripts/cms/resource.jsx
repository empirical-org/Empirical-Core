EC.Resource = React.createClass({
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
      textInputGenerator: new EC.modules.TextInputGenerator(this, this.updateModelState),
      server: new EC.modules.Server(this.props.resourceNameSingular, this.props.resourceNamePlural, '/cms')
    }
  },

  updateModelState: function (key, value) {
    var newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  },

  removeNestedResourceAndSave: function (kind, resource) {
    var newModel = this.state.model
    var nest = newModel[kind]
    var newNest = _.reject(nest, function (r) { return r.id == resource.id })
    this.nestedResourceSaveHelper(kind, newNest)
  },

  nestedResourceSaveHelper: function (kind, newNest) {
    var newModel = this.state.model
    newModel[kind] = newNest;
    var data = _.pick(newModel, this.props.savingKeys)
    var options = {
      callback: this.nestedResourceSaveCallback,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options)
  },

  nestedResourceSaveCallback: function (data) {
    console.log('callback data', data)
    this.setState({model: data.admin_account})
  },

  saveNestedResource: function (kind, resource) {
    //https://robots.thoughtbot.com/accepts-nested-attributes-for-with-has-many-through
    var newModel = this.state.model
    var nest = newModel[kind]
    var newNest = _.chain(nest).push(resource).value()
    this.nestedResourceSaveHelper(kind, newNest)
  },

  save: function () {
    console.log('modle to save', this.state.model)
    var data = _.pick(this.state.model, this.props.savingKeys);
    console.log('data well send', data)
    var options = {
      callback: this.props.returnToIndex,
      savingKeys: this.props.savingKeys,
      fieldsToNormalize: this.props.fieldsToNormalize
    }
    this.modules.server.save(data, options);
  },


  render: function () {
    var inputs = this.modules.textInputGenerator.generate(this.props.formFields);
    var nestedResources = _.map(this.props.nestedResources, function (nr) {
      var resources = this.state.model[nr.name];
      var data = _.extend(nr, {resources: resources})
      return <EC.cms.NestedResource data={data} actions={{save: this.saveNestedResource, delete: this.removeNestedResourceAndSave}} />
    }, this);
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div clasName='row'>
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