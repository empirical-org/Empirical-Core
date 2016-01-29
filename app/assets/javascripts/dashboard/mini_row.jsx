EC.MiniRow = React.createClass({


  createMinis: function() {
    var i = 0;
    var minis = _.map(classes, function(classObj) {
      if (i === 3) {
        i = 0;
      }
      i++;
      return <EC.ClassMini classObj={classObj} rowNum={i}/>;
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
