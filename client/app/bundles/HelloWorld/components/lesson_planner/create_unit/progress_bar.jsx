'use strict'

 import React from 'react'

 export default React.createClass({
   render: function() {
    var graphicClass1 = (this.props.stage === 1 ? 'disabled' : 'complete');
    return (
      <div className="container">
        <section className="section-content-wrapper">

          <div className="bs-wizard">
            <div className={"select_activities_progress_bar col-xs-3 bs-wizard-step complete"}>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="text-center bs-wizard-info">Select Activities</div>
            </div>

            <div className={"assign_activities_progress_bar col-xs-3 bs-wizard-step " +  graphicClass1}>
              <div className="progress"><div className="progress-bar"></div></div>
              <a href="#" className="bs-wizard-dot"></a>
              <div className="text-center bs-wizard-info">Assign Activities</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
});
