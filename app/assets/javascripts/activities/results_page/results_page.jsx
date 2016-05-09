'use strict'
EC.ResultsPage = React.createClass({

    headerMessage: function() {
        return (
            <div>
                <h1>Lesson Complete!</h1>
                <h3>You completed the activity: {this.props.activityName}</h3>
                <a href='/profile'><button className='btn button-green'>Back to Your Dashboard<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </button></a>
            </div>
        );
    },

    render: function() {
        return (
            <div id='results-page' className='container-fluid'>
              <div className='top-section'>
                <EC.ResultsIcon percentage={this.props.percentage} activityType={this.props.activityType}/>
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
