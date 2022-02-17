import React from 'react'
import Server from '../modules/server/server.jsx'
import Fnl from '../modules/fnl.jsx'
import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx'
import IndicatorGenerator from '../modules/indicator_generator.jsx'
import _ from 'underscore'

export default class ActivityClassification extends React.Component {
  constructor(props) {
    super(props);

    this.resourceNameSingular = 'activity_classification';
    this.resourceNamePlural = 'activity_classifications';

    this.formFields = [
      { name: 'name' },
      { name: 'key' },
      { name: 'form_url' },
      { name: 'module_url' },
      { name: 'order_number' }
    ];

    this.initializeModules();

    let model = {
      name: null,
      key: null,
      form_url: null,
      module_url: null,
      order_number: this.props.activityClassification.order_number || null
    }
    model = _.extend(model, this.props.activityClassification);
    this.state = { model };
  }

  getModelState(key) {
    return this.state.model[key];
  }

  initializeModules() {
    let fnl = new Fnl();
    let server = new Server(this.resourceNameSingular, this.resourceNamePlural, '/cms');
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateModelState),
      server: server,
      indicatorGenerator: new IndicatorGenerator(this.getModelState, this.updateModelState, fnl)
    };
  }

  save = () => {
    const model = this.state.model;
    this.modules.server.save(model);
  };

  updateModelState = (key, value, context) => {
    let newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  }

  render() {
    let inputs;
    inputs = this.modules.textInputGenerator.generate(this.formFields);
    return(
      <div className='edit_activity_classification cms-form'>
        {inputs}
        <button className='button-green pull-right' id='save' onClick={this.save}>Save</button>
      </div>
    )
  }
}
