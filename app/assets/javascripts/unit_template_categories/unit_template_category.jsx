EC.UnitTemplateCategory = React.createClass({

  getInitialState: function () {
    this.initializeModules();

    var model = {
      name: null
    };
    var model2 = _.extend(model, this.props.unitTemplateCategory);

    var hash = {
      model: model2
    };
    return hash;
  },

  resourceNameSingular: 'unit_template_category',
  resourceNamePlural: 'unit_template_categories',


  initializeModules: function () {
    this.modules = {
      textInputGenerator: new EC.TextInputGenerator(this, this.updateModelState),
      server: new EC.Server(this)
    }
  },

  updateModelState: function (key, value) {
    var newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  },

  save: function () {
    this.modules.server.cmsSave(this.state.model, this.props.returnToIndex)
  },

  formFields: function () {
    return [
      {
        name: 'name'
      }
    ]
  },

  render: function () {
    var inputs = this.modules.textInputGenerator.generate(this.formFields());
    return (
      <div>
        <a onClick={this.props.returnToIndex}>Back to List of Activity Pack Categories</a>
        <div>
          <div>{inputs}</div>
          <button onClick={this.save} className='button-green pull-left'>Save</button>
        </div>
      </div>
    );
  }

});