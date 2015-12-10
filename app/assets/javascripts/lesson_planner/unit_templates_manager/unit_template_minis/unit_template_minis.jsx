EC.UnitTemplateMinis = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.modules = {
      rowsCreator: new EC.modules.RowsCreator(this.colView, this.rowView, 2)
    }
    console.log(this.props.actions);
    return {};
  },

  generateUnitTemplateViews: function () {
    var grade = this.props.data.grade;
    var models;
    if (grade) {
      models = _.reject(this.props.data.displayedModels, function (m){
        return _.indexOf(m.grades, grade.toString());
      });
    } else {
      models = this.props.data.displayedModels
    }
    var rows = this.modules.rowsCreator.create(models);
    return <span>{rows}</span>;
  },

  generateUnitTemplateView: function (model, index) {
    return <EC.UnitTemplateMini key={model.id}
                                data={model}
                                index={index}
                                actions={this.props.actions} />
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
    if (this.props.data.grade) {
      return
    } else {
      return (
          <div className='list-filter-options-container'>
            <EC.ListFilterOptions
                    options={this.props.data.categories}
                    selectedId={this.props.data.selectedCategoryId}
                    select={this.props.actions.filterByCategory} />
          </div>
      );
    }
  },

  render: function () {
    return (
      <div className='unit-template-minis'>
        <EC.UnitTemplateMinisHeader data={this.props.data} />
        <div className="container">
          <div className='row'>
            <div className='col-xs-12'>
              <div className='row'>
                {this.listFilterOptions()}
              </div>
              <div className='row'>
                {this.generateUnitTemplateViews()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
})