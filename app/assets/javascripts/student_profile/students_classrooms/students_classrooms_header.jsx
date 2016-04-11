'use strict'
EC.StudentsClassroomsHeader = React.createClass({


  getInitialState: function() {
    return {classrooms: null}
  },

  componentDidMount: function() {
    $.ajax({url: 'students_classrooms', format: 'json', success: this.updateClassrooms})
  },

  updateClassrooms: function(data) {
    this.setState({classrooms: data.classrooms})
  },

  isActive: function(id, index) {
    if (id === this.props.currentClassroomId) {
     return 'active';
     }
  },


  findWithAttr: function (array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i]['props'][attr] === value) {
            return i;
        }
    }
  },
  mapClassrooms: function() {
    var that = this
    var classrooms = _.map(this.state.classrooms, function(classroom, index) {
      return (
        <div className={that.isActive(classroom.id, index) + ' classroom-box'} key={classroom.id} onClick={that.props.fetchData.bind(null, classroom.id)}>
          <div>{classroom.teacher}</div>
        <div>{classroom.name}</div>
      </div>
    )
    });
    // gets index of active classroom react element
    var indx = that.findWithAttr(classrooms, 'className', 'active classroom-box')

    // active splices active classroom element from array
    var active = classrooms.splice(indx,1)[0]

    // then this line moves it to front so that it will always be left most item
    classrooms.unshift(active)
    return classrooms
  },

  render: function() {
    return(<div>{this.mapClassrooms()}</div>)
  }




})
