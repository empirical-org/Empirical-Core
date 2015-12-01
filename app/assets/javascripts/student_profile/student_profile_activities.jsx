'use strict';
EC.StudentProfileActivities = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    header: React.PropTypes.string.isRequired
  },

  sayCount: function () {
    return [this.props.data.length, 'of', this.props.count].join(' ');
  },

  render: function () {
    var activities = _.map(this.props.data, function (ele) {
      return <EC.StudentProfileActivity data={ele} />
    });
    return (
      <div className="fake-table">
        <div className="header">{this.props.header}
          <span className="header-list-counter">{this.sayCount()}</span>
        </div>
        {activities}
      </div>
    );
  }
})