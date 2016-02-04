EC.MiniRow = React.createClass({


  createMinis: function() {
    var i = 0;
    var minis = _.map(classes, function(classObj) {
      return <EC.ClassMini classObj={classObj}/>;
    });
    return minis;
  },


  render: function() {
    console.log('class_mini');
    return (
      <div className="row">
        {this.createMinis()}
      </div>
    );
  }
});
