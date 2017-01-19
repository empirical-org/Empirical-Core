'use strict'

 import React from 'react'

 export default React.createClass({

  miniBuilder: function() {
    return (
      <div className="mini_content">
        <div className="gray-underline">
          <h3>Two New Writing Tools</h3>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', margin: '0px 15px'}}>
          <a href='/tools/diagnostic'><div style={{margin: '15px'}} className="activate-tooltip icon-wrapper icon-green icon-diagnostic" data-original-title="" title=""></div></a>
          <a href='/tools/connect'><div style={{margin: '15px'}} className="activate-tooltip icon-wrapper icon-green icon-connect" data-original-title="" title=""></div></a>
        </div>
          <p style={{padding: '0px 15px'}}>Use Quill’s diagnostic to assess students and build a learning plan. Use Quill Connect to build sentence structure skills.</p>
          <a href='/tools/diagnostic'><button className="button button-white beta">Learn More</button></a>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container results-overview-mini-container col-md-4 col-sm-5 text-center"}>
        {this.miniBuilder()}
      </div>
    );
  }
});
