'use strict';
$(function () {
  var ele = $('#unit-templates');
  if (ele.length > 0) {
    var props, comp;
    props = {}
    comp = React.createElement(EC.UnitTemplates, props);
    React.render(comp, ele[0]);
  }
});



EC.UnitTemplates = React.createClass({

  getInitialState: function () {
    this.initializeModules()
    return ({
      models: [],
      displayedModels: [],
      unitTemplateCategories: []
    });
  },

  initializeModules: function () {
    var server = new EC.Server('unit_template', 'unit_templates');
    server.setUrlPrefix('/teachers');
    this.modules = {
      server: server
    }
  },

  componentDidMount: function () {
    this.modules.server.getModels(this.updateModels);
  },

  updateModels: function (models) {
    this.setState({models: models});
    this.updateUnitTemplateCategories();
    this.bootstrapDisplayedModels();
  },

  updateUnitTemplateCategories: function () {
    this.setState({unitTemplateCategories: this.getUnitTemplateCategories()})
  },

  bootstrapDisplayedModels: function () {
    this.setState({displayedModels: this.state.models});
  },

  generateUnitTemplateViews: function () {
    return _.map(this.state.displayedModels, this.generateUnitTemplateView, this);
  },

  generateUnitTemplateView: function (model) {
    return <EC.UnitTemplate key={model.id} data={model} />
  },

  getUnitTemplateCategories: function () {
    return _.chain(this.state.models)
              .pluck('unit_template_category')
              .uniq(_.property('id'))
              .value();
  },

  filterByUnitTemplateCategory: function (categoryId) {
    var uts = _.where(this.state.models, {unit_template_category: {id: categoryId}})
    this.setState({displayedModels: uts});
  },

  listFilterOptions: function () {
    return <EC.ListFilterOptions options={this.state.unitTemplateCategories}
                  select={this.filterByUnitTemplateCategory} />
  },

  render: function () {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-12'>
              {this.listFilterOptions()}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              {this.generateUnitTemplateViews()}
            </div>
          </div>
        </div>
      </div>
    );
  }
})