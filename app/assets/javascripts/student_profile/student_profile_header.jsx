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
            <div className='classroom'>
              <div className='icon icon-book-white' />
              <div className='classroom-name'>{this.props.data.classroom.name}</div>
            </div>
            <div className='teacher'>
              <div className='icon icon-hat-white' />
              <div className='teacher-name'>{this.props.data.classroom.teacher.name}</div>
            </div>
          </span>
        </div>
      </div>
    )
  }
})
