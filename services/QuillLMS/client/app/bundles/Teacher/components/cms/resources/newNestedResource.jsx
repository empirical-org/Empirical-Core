import React from 'react'
import TextInputGenerator from '../../modules/componentGenerators/text_input_generator.jsx'

export default class NewNestedResource extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState)
    }

    this.state = {
      model: {id: null}
    };
  }

  updateModelState = (key, value) => {
    let model = this.state.model;
    model[key] = value;
    this.setState({model: model});
  };

  save = () => {
    this.props.actions.save(this.props.data.name, this.state.model);
  };

  render() {
    let inputs = this.modules.textInputGenerator.generate(this.props.data.formFields)
    return (
      <div>
        <h5> Add New : </h5>
        <br />
        {inputs}
        <button onClick={this.save}>add</button>
      </div>
    )
  }
}
