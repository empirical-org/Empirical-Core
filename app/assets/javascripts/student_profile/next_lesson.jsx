'use strict';
EC.NextLesson = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="container">
        <section>
          <div className="row">
            <div className="col-xs-12 col-sm-7 col-xl-7">
              <div className="activate-tooltip icon-wrapper icon-gray icon-puzzle"></div>
              <div className="icons-description-wrapper">
                <p className="title title-v-centered">{this.props.data.activity.name}</p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-5 col-xl-5 start-activity-wrapper">
              <a href={this.props.data.link}>
                <button className='button-green pull-right'>Start Your Next Lesson</button>
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }
})
