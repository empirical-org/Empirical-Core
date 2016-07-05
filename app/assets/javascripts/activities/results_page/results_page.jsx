'use strict'
EC.ResultsPage = React.createClass({
  headerButton: function () {
    if (this.props.anonymous) {
      return (<a href='/account/new'>
        <button className='btn button-green'>
          Sign Up<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
        </button>
      </a>)
    } else {
      return (
        <a href='/profile'>
          <button className='btn button-green'>
            Back to Your Dashboard<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
        </a>
      )
    }
  },

  headerMessage: function() {
    return (
      <div>
        <h1>
          Lesson Complete!
        </h1>
        <h3>
          You completed the activity: {this.props.activityName}
        </h3>
        {this.headerButton()}
      </div>
    );
  },

  render: function() {
    return (
      <div
        id='results-page'
        className='container-fluid'>
        <div className='top-section'>
          <EC.ResultsIcon
            percentage={this.props.percentage}
            activityType={this.props.activityType}/>
          {this.headerMessage()}
        </div>
        <div className='bottom-section'>
          <div className='results-wrapper'>
            <EC.StudentResultsTables results={this.props.results}/>
          </div>
        </div>
      </div>
    );
  }

});
