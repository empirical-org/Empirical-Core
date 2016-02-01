EC.MyClasses = React.createClass({

  createMinis: function() {
    var classes = this.props.classList;
    var minis = _.map(classes, function(classObj) {
      return <EC.ClassMini classObj={classObj} key={classObj.classroom.code}/>;
    });
    return minis;
  },

  render: function() {
    return (
      <div className='classes_container'>
    <h3 className='dashboard-header'>My Classes</h3>
      <div className='row'>
        {this.createMinis()}
        <EC.AddClassMini/>
      </div>
    </div>
    );
  }

});
