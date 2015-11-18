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
      model: null,
      relatedModels: [],
      displayedModels: [],
      selectedCategoryId: null
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
    var relatedModels = this.modelsInCategory(ut.unit_template_category.id)
    this.setState({stage: 'profile', model: ut, relatedModels: relatedModels})
  },

  modelsInCategory: function (categoryId) {
    return _.where(this.state.models, {unit_template_category: {id: categoryId}})
  },

  updateModels: function (models) {
    this.setState({models: models, displayedModels: models});
    this.updateUnitTemplateCategories();
    // just while working on html :
    this.selectModel(models[0])
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


  filterByCategory: function (categoryId) {
    if (categoryId) {
      var uts = this.modelsInCategory(categoryId)
    } else {
      var uts = this.state.models;
    }

    this.setState({displayedModels: uts, selectedCategoryId: categoryId});
  },

  unitTemplatesData: function () {
    return {
      categories: this.state.categories,
      displayedModels: this.state.displayedModels,
      selectedCategoryId: this.state.selectedCategoryId
    }
  },

  unitTemplatesEventHandlers: function () {
    return {
      filterByCategory: this.filterByCategory,
      selectModel: this.selectModel
    }
  },

  unitTemplateProfileData: function () {
    return {
      model: this.state.model,
      relatedModels: this.state.relatedModels
    }
  },

  unitTemplateProfileEventHandlers: function () {
    return {
      assign: this.assign,
      selectModel: this.selectModel,
      fitlerByCategory: this.filterByCategory,
      returnToIndex: this.returnToIndex
    }
  },

  stageSpecificComponents: function () {
    if (this.state.stage === 'index') {
      return (
        <EC.UnitTemplates
            data={this.unitTemplatesData()}
            eventHandlers={this.unitTemplatesEventHandlers()}/>

      );
    } else if (this.state.stage === 'profile') {
      return (
        <EC.UnitTemplateProfile
            data={this.unitTemplateProfileData()}
            eventHandlers={this.unitTemplateProfileEventHandlers()} />
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