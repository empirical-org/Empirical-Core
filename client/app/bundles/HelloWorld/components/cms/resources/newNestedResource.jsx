import React from 'react'
import TextInputGenerator from '../../modules/componentGenerators/text_input_generator.jsx'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState)
    }
    return {
      model: {id: null}
    };
  },

  updateModelState: function (key, value) {
    var model = this.state.model;
    model[key] = value;
    this.setState({model: model});
  },

  save: function () {
    this.props.actions.save(this.props.data.name, this.state.model);
  },

  render: function () {
    var inputs = this.modules.textInputGenerator.generate(this.props.data.formFields)
    return (
      <div>
        <h5> Add New : </h5>
        <br />
        {inputs}
        <button onClick={this.save}>add</button>
      </div>
    )
  }
})
