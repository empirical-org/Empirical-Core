EC.Resource = React.createClass({
  propTypes: {
    resourceNameSingular: React.PropTypes.string.isRequired,
    resourceNamePlural: React.PropTypes.string.isRequired,
    initialModel: React.PropTypes.object.isRequired,
    resource: React.PropTypes.object.isRequired,
    formFields: React.PropTypes.array.isRequired,
    returnToIndex: React.PropTypes.func.isRequired,
    savingKeys: React.PropTypes.array.isRequired,
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
    return (
      <div>
        <a onClick={this.props.returnToIndex}>{['Back to List of', this.props.resourceNamePlural].join(' ')}</a>
        <div>
          <div>{inputs}</div>
          <button onClick={this.save} className='button-green pull-left'>Save</button>
        </div>
      </div>
    );
  }

});