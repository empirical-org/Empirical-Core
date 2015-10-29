'use strict';
EC.UnitTemplatesManager = React.createClass({
  propTypes: {
    loadActivityPackIntoUnitCreator: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    this.initializeModules()
    return ({
      models: [],
      categories: [],
      stage: 'index', // index, profile,
      model: null
    });
  },

  initializeModules: function () {
    var server = new EC.modules.Server('unit_template', 'unit_templates', '/teachers');
    this.modules = {
      server: server
    }
  },

  componentDidMount: function () {
    this.modules.server.getModels(this.updateModels);
  },

  selectModel: function (ut) {
    this.setState({stage: 'profile', model: ut})
  },

  updateModels: function (models) {
    this.setState({models: models});
    this.updateUnitTemplateCategories();
  },

  updateUnitTemplateCategories: function () {
    this.setState({categories: this.getUnitTemplateCategories()})
  },

  getUnitTemplateCategories: function () {
    return _.chain(this.state.models)
              .pluck('unit_template_category')
              .uniq(_.property('id'))
              .value();
  },

  assign: function (data) {
    // takes you to stage 2 of unit creator
    this.props.loadActivityPackIntoUnitCreator(data);
  },

  returnToIndex: function () {this.setState({stage: 'index', model: null})},

  stageSpecificComponents: function () {
    if (this.state.stage === 'index') {
      return (
        <EC.UnitTemplates models={this.state.models}
                          categories={this.state.categories}
                          selectModel={this.selectModel}/>
      );
    } else if (this.state.stage === 'profile') {
      return (
        <EC.UnitTemplate model={this.state.model}
            assign={this.assign}
            returnToIndex={this.returnToIndex}/>
      )
    }
  },

  render: function () {
    return (
      <div className='container unit-templates-manager'>
        {this.stageSpecificComponents()}
      </div>
    );
  }
})