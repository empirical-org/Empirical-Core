EC.UnitTemplate = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    filterByUnitTemplateCategory: React.PropTypes.func.isRequired,
    index: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    this.modules = {
      string: new EC.modules.String()
    }
    return {};
  },

  number_of_activities: function () {
    return this.props.data.activities.length;
  },

  say_time: function () {
    return [this.props.data.time, 'mins'].join(' ');
  },

  say_number_of_activities: function () {
    return this.modules.string.sayNumberOfThings(this.number_of_activities(), 'Activity', 'Activities')
  },



  getData: function () {
    return [this.props.data.name,
            this.say_author(),
            this.unit_template_category_name(),
            this.say_time(),
            this.say_number_of_standards(),
            this.say_number_of_activities()];
  },

  displayData: function () {
    return _.map(this.getData(), this.displayDatum, this);
  },

  displayDatum: function (string) {
    return (
      <div key={string} className='row'>
        <div className='col-xs-6'>
          {string}
        </div>
      </div>);
  },

  avatarUrl: function () {
    var url;
    if (this.props.data.author) {
      url = this.props.data.author.avatar_url
    } else {
      url = null;
    }
    return url;
  },

  displayPicture: function () {
    return (
      <div className='picture'>
        <img src={this.avatarUrl()}></img>
      </div>
    );
  },

  getClassName: function () {
    var val;
    if (this.props.index === 1) {
      val = 'row unit-template pull-right'
    } else {
      val = 'row unit-template'
    }
    return val;
  },

  render: function () {
    return (
      <div className={this.getClassName()}>
        <div className='col-xs-12'>
          <EC.UnitTemplateFirstRow
              filterByUnitTemplateCategory={this.props.filterByUnitTemplateCategory}
              data={this.props.data}
              modules={{string: this.modules.string}} />
          <EC.UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
          {this.displayPicture()}
        </div>
      </div>
    );
  }
});