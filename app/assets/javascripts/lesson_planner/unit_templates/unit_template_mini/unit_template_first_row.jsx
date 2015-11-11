EC.UnitTemplateFirstRow = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired,
    modules: React.PropTypes.shape({
      string: React.PropTypes.object.isRequired
    })
  },

  sayNumberOfStandards: function () {
    return this.props.modules.string.sayNumberOfThings(this.props.data.number_of_standards, 'Standard', 'Standards');
  },

  sayCategory: function () {
    var name;
    if (this.props.data.unit_template_category) {
      name = this.props.data.unit_template_category.name.toUpperCase();
    } else {
      name = null;
    }
    return name;
  },

  filterCategory: function () {
    if (this.props.data.unit_template_category) {
      this.props.eventHandlers.filterByCategory(this.props.data.unit_template_category.id)
    }
  },

  getClassName: function () {
    return ['row', 'first-row'].join(' ');
  },

  getBackgroundColor: function () {
    return this.props.data.unit_template_category.primary_color;
  },

  getCategoryBackgroundColor: function () {
    return this.props.data.unit_template_category.secondary_color;
  },

  render: function () {
    return (
      <div style={{backgroundColor: this.getBackgroundColor()}} className={this.getClassName()}>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-8'>
              <div className='standards-count'>
                {this.sayNumberOfStandards()}
              </div>
            </div>
            <div className='col-xs-4 unit-template-category-label-container'>
              <div onClick={this.filterCategory}
                    className='unit-template-category-label img-rounded'
                    style={{backgroundColor: this.getCategoryBackgroundColor()}}>
                {this.sayCategory()}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div className='unit-template-name'>
                {this.props.data.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

});
