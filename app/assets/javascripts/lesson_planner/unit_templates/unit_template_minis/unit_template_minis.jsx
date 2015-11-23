EC.UnitTemplateMinis = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.initializeModules()
    return {};
  },

  initializeModules: function () {
    this.modules = {
      rowsCreator: new EC.modules.RowsCreator(this.colView, this.rowView, 2)
    }
  },

  generateUnitTemplateViews: function () {
    var rows = this.modules.rowsCreator.create(this.props.data.displayedModels);
    return <span>{rows}</span>;
  },

  generateUnitTemplateView: function (model, index) {
    return <EC.UnitTemplateMini key={model.id}
                                data={model}
                                index={index}
                                eventHandlers={this.props.eventHandlers} />
  },

  colView: function (data, index) {
    var className;
    if (index === 0) {
      className = 'col-sm-6 col-xs-12 no-pr'
    } else {
      className = 'col-sm-6 col-xs-12 no-pl'
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

  listFilterOptions: function () {
    return (
        <div className='list-filter-options-container'>
          <EC.ListFilterOptions
                  options={this.props.data.categories}
                  selectedId={this.props.data.selectedCategoryId}
                  select={this.props.eventHandlers.filterByCategory} />
        </div>
    );
  },

  render: function () {
    return (
      <div className='unit-template-minis'>
        <EC.UnitTemplateMinisHeader />
        <div className="container">
          <div className='row'>
            <div className='col-xs-12'>
              <div className='row'>
                <div className='col-xs-12'>
                  {this.listFilterOptions()}
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12'>
                  //{this.generateUnitTemplateViews()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
})