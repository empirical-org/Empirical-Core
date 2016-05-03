'use strict'
EC.ResultsPage = React.createClass({


    score: function() {
        return <div>
          {this.props.percentage}
        </div>
    },

    headerMessage: function() {
        return (
            <div>
                <h1>Lesson Complete!</h1>
                <h3>You completed the activity: {this.props.activitySession}</h3>
                <button className='btn button-green'>Back to Your Dashboard<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        );
    },

    render: function() {
        return (
            <div id='results-page' className='container-fluid'>
              <div className='top-section'>
                {this.score()}
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
