'use strict';
$(function () {
  var ele = $('#teachers-unit-templates');
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
      unitTemplateCategories: [],
      selectedCategoryId: null
    });
  },

  initializeModules: function () {
    var server = new EC.Server('unit_template', 'unit_templates');
    server.setUrlPrefix('/teachers');
    this.modules = {
      server: server,
      rowsCreator: new EC.RowsCreator(this.colView, this.rowView, 2)
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
    var rows = this.modules.rowsCreator.create(this.state.displayedModels);
    return <span>{rows}</span>;
  },

  generateUnitTemplateView: function (model, index) {
    return <EC.UnitTemplate
              filterByUnitTemplateCategory={this.filterByUnitTemplateCategory}
              key={model.id}
              data={model}
              index={index} />
  },

  colView: function (data, index) {
    var className;
    if (index === 0) {
      className = 'col-xs-6 no-pr'
    } else {
      className = 'col-xs-6 no-pl'
    }
    return (
      <div className={className}>
        {this.generateUnitTemplateView(data, index)}
      </div>
    );
  },

  rowView: function (cols) {
    return <div className='row'>{cols}</div>;
  },

  getUnitTemplateCategories: function () {
    return _.chain(this.state.models)
              .pluck('unit_template_category')
              .uniq(_.property('id'))
              .value();
  },

  filterByUnitTemplateCategory: function (categoryId) {
    if (categoryId) {
      var uts = _.where(this.state.models, {unit_template_category: {id: categoryId}})
    } else {
      var uts = this.state.models;
    }

    this.setState({displayedModels: uts, selectedCategoryId: categoryId});
  },

  listFilterOptions: function () {
    return (
        <div className='list-filter-options-container'>
          <EC.ListFilterOptions
                  options={this.state.unitTemplateCategories}
                  selectedId={this.state.selectedCategoryId}
                  select={this.filterByUnitTemplateCategory} />
        </div>
    );
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