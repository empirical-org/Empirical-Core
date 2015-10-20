EC.UnitTemplates = React.createClass({
  propTypes: {
    models: React.PropTypes.array.isRequired,
    categories: React.PropTypes.array.isRequired,
    selectModel: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    this.initializeModules()
    return ({
      displayedModels: this.props.models,
      selectedCategoryId: null
    });
  },

  initializeModules: function () {
    this.modules = {
      rowsCreator: new EC.modules.RowsCreator(this.colView, this.rowView, 2)
    }
  },

  generateUnitTemplateViews: function () {
    var displayedModels = (this.state.displayedModels.length ? this.state.displayedModels: this.props.models);
    var rows = this.modules.rowsCreator.create(displayedModels);
    return <span>{rows}</span>;
  },

  generateUnitTemplateView: function (model, index) {
    return <EC.UnitTemplateMini
              filterByUnitTemplateCategory={this.filterByUnitTemplateCategory}
              key={model.id}
              data={model}
              selectModel={this.props.selectModel}
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

  filterByUnitTemplateCategory: function (categoryId) {
    if (categoryId) {
      var uts = _.where(this.props.models, {unit_template_category: {id: categoryId}})
    } else {
      var uts = this.props.models;
    }

    this.setState({displayedModels: uts, selectedCategoryId: categoryId});
  },

  listFilterOptions: function () {
    return (
        <div className='list-filter-options-container'>
          <EC.ListFilterOptions
                  options={this.props.categories}
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