'use strict';
EC.StudentProfileHeader = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="section-header">{this.props.data.name}</span>
          <span className="pull-right student-course-info">
            <EC.StudentsClassroomsHeader currentClassroomId={this.props.data.classroom.id}/>
          </span>
        </div>
      </div>
    )
  }
})
