EC.UnitTemplateMini = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
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
      <div className='author-picture'>
        <img src={this.avatarUrl()}></img>
      </div>
    );
  },

  getClassName: function () {
    var val;
    if (this.props.index === 1) {
      val = 'row unit-template-mini pull-right'
    } else {
      val = 'row unit-template-mini'
    }
    return val;
  },

  selectModel: function () {
    this.props.actions.selectModel(this.props.data)
  },

  render: function () {
    return (
      <div className={this.getClassName()} onClick={this.selectModel}>
        <div className='col-xs-12'>
          <EC.UnitTemplateFirstRow
              actions={{filterByCategory: this.props.actions.filterByCategory}}
              data={this.props.data}
              modules={{string: this.modules.string}} />
          <EC.UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
          {this.displayPicture()}
        </div>
      </div>
    );
  }
});