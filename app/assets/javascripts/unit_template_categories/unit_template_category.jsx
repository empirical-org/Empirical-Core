EC.UnitTemplateCategory = React.createClass({

  getInitialState: function () {
    this.initializeModules();
    return {
      selected: {
        name: null
      }
    };
  },

  initializeModules: function () {
    this.modules = {
      textInputGenerator: new EC.TextInputGenerator(this, this.updateSelectedState)
    }
  },

  updateSelectedState: function (key, value) {
    var newState = this.state;
    newState.selected[key] = value;
    this.setState(newState);
  },

  save: function () {
    console.log('save')
  },

  formFields: [
    {
      name: 'name'
    }
  ],

  render: function () {
    var inputs = this.modules.textInputGenerator.generate(this.formFields);
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