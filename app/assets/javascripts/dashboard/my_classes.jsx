EC.MyClasses = React.createClass({

  createMinis: function(classes) {
    debugger;
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

  componentDidMount: function() {
    // this.fetchData();
  },

  fetchData: function () {
    $.ajax({
    	url: 'retrieve_classrooms_for_assigning_activities',
    	// url: 'classrooms',
    	success: this.displayData
    });
  },

  displayData: function (data) {
    return this.createMinis(data.classrooms_and_their_students);
  },



  render: function() {
    return (
      <div className='classes_container'>
    <h3 className='dashboard-header'>My Classes</h3>
      <div className='row'>
        {this.fetchData()}
      </div>
    </div>
    );
  }

});
