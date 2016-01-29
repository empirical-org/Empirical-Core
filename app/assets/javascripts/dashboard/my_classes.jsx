EC.MyClasses = React.createClass({

  createMinis: function() {
    var i = 0;
    var classes = this.props.classList;
    // 'addClass' is pushed as the last element of the array so that we know can always add
    // an addClass button at the end
    classes.push('addClass');
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
    return (
      <div className='classes_container'>
    <h3 className='dashboard-header'>My Classes</h3>
      <div className='row'>
        {this.createMinis()}
      </div>
    </div>
    );
  }

});
