EC.UnitTemplate = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  number_of_activities: function () {
    return this.props.data.activities.length;
  },

  say_time: function () {
    return [this.props.data.time, 'mins'].join(' ');
  },

  author_name: function () {
    var name;
    if (this.props.data.author) {
      name = this.props.data.author.name;
    } else {
      name = null;
    }
    return name;
  },

  say_author: function () {
    return ['by', this.author_name()].join(' ');
  },

  say_number_of_things: function (number, singular, plural) {
    var value;
    if (number == 1) {
      value = singular;
    } else {
      value = plural;
    }
    return [number, value].join(' ');
  },

  say_number_of_activities: function () {
    return this.say_number_of_things(this.number_of_activities(), 'Activity', 'Activities')
  },

  say_number_of_standards: function () {
    return this.say_number_of_things(this.props.data.number_of_standards, 'Standard', 'Standards');
  },

  unit_template_category_name: function () {
    var name;
    if (this.props.data.unit_template_category) {
      name = this.props.data.unit_template_category.name;
    } else {
      name = null;
    }
    return name;
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

  render: function () {
    return (
      <div className='unit-template'>
        {this.displayData()}
      </div>
    );
  }
});