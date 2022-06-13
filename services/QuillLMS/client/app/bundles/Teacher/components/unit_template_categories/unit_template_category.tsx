import * as React from 'react'
import _ from 'underscore'

import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx'
import Server from '../modules/server/server.jsx';

interface UnitTemplateCategoryProps {
  unitTemplateCategory: {
    id: Number,
    name: string,
    primary_color: string,
    secondary_color: string
  }
}

interface UnitTemplateCategoryState {
  resourceNameSingular: string,
  resourceNamePlural: string,
  model: {
    id: Number,
    name: string,
    primary_color: string,
    secondary_color: string
  }
  formFields: Array<Object>,
  savingKeys: Array<string>,
  modules: {
    textInputGenerator: TextInputGenerator,
    server: Server
  }
}

export default class UnitTemplateCategory extends React.Component<UnitTemplateCategoryProps, UnitTemplateCategoryState> {
  constructor(props) {
    super(props);
    const { unitTemplateCategory } = this.props

    const initialModel = {
      name: null
    };

    const formFields = [
      {
        name: 'name'
      },
      {
        name: 'primary_color',
        label: 'primary color'
      },
      {
        name: 'secondary_color',
        label: 'secondary color'
      }
    ];

    const resourceNamePlural = 'unit_template_categories'
    const resourceNameSingular = 'unit_template_category'

    const savingKeys = ['name', 'id', 'primary_color', 'secondary_color'];

    const model1 = _.extend(initialModel, unitTemplateCategory);

    this.state = {
      resourceNameSingular: resourceNameSingular,
      resourceNamePlural: resourceNamePlural,
      model: model1,
      formFields: formFields,
      savingKeys: savingKeys,
      modules: {
        textInputGenerator: new TextInputGenerator(this, this.updateModelState),
        server: new Server(resourceNameSingular, resourceNamePlural, '/cms')
      }
    }
  }

  handleSave = () => {
    const { modules, model, savingKeys } = this.state
    const data = _.pick(model, savingKeys);
    const options = {
      savingKeys: savingKeys
    }
    modules.server.save(data, options);
  };

  updateModelState = (key, value) => {
    let newState = this.state;
    newState.model[key] = value;
    this.setState(newState);
  }

  render() {
    const { modules, formFields } = this.state
    let inputs = modules.textInputGenerator.generate(formFields);
    return(
      <div className='edit_activity_classification cms-form'>
        {inputs}
        <button className='button-green pull-right' id='continue' onClick={this.handleSave} type="button">Save</button>
      </div>
    )
  }
}
