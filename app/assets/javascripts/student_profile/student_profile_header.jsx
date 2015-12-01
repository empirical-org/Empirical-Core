'use strict';
EC.StudentProfileHeader = React.createClass({
  propTypes: {
    studentName: React.PropTypes.string.isRequired,
    classroomName: React.PropTypes.string.isRequired,
    teacherName: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="section-header">{this.props.studentName}</span>
          <span className="pull-right student-course-info">
            <div className='classroom'>
              <div className='icon icon-book-white' />
              <div className='classroom-name'>{this.props.classroomName}</div>
            </div>
            <div className='teacher'>
              <div className='icon icon-hat-white' />
              <div className='teacher-name'>{this.props.teacherName}</div>
            </div>
          </span>
        </div>
      </div>
    )
  }
})
