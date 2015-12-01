'use strict';
EC.StudentProfileUnit = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    /*
    completed activities is just another fake table under unstarted activities
    */
    var count = this.props.data.unstarted.length + this.props.data.finished.length;
    var activities = _.map([{data: this.props.data.unstarted, header: 'Assigned Activities'}, {data: this.props.data.finished, header: 'Completed Activities'}], function (ele) {
      return <EC.StudentProfileActivities data={ele.data} header={ele.header} count={count} />
    });
    return (
      <section>
        <h3 className="section-header">{this.props.unitName}</h3>
        {activities}
      </section>
    );
  }
});