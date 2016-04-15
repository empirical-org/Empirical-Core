EC.MiniRow = React.createClass({


  createMinis: function() {
    var minis = _.map(classes, function(classObj) {
      return <EC.ClassMini classObj={classObj}/>;
    });
    return minis;
  },


  render: function() {
    return (
      <div className="row">
        {this.createMinis()}
      </div>
    );
  }
});
