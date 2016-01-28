EC.MyClasses = React.createClass({

  createMinis: function() {
    var classes = ['1st Period','2nd Period','3rd Period'];
    var minis = _.map(classes, function(classObj) {
      return <EC.ClassMini classObj={classObj}/>
    });
    return minis;
  },


  render: function() {
    return (
      <div>
    <h3 className='dashboard-header'>My Classes</h3>
      <div className='row'>
        {this.createMinis()}
      </div>
    </div>
    );
  }

});
