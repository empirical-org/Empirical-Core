EC.Stage2 = React.createClass({
  getInitialState: function() {
    return {
      classroomsAndTheirStudents: []      
    };
  },

  componentDidMount: function() {
    this.fetchClassrooms();
  },

  fetchClassrooms: function() {
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',  
      context: this,
      success: function (data) {
        this.fetchClassroomsSuccess(data);
      },  
      error: function () {
        console.log('error fetching classrooms');
      }
    });
  },

  fetchClassroomsSuccess: function(data) {
    this.setState({classroomsAndTheirStudents: data.classroomsAndTheirStudents});
  },

  render: function() {
    return (
      <span>Stage2</span>
    );
  }
});