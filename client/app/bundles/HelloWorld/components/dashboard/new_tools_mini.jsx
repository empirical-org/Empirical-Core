'use strict'

 import React from 'react'

 export default React.createClass({

  miniBuilder: function() {
    return (
      <div className="mini_content">
        <div className="gray-underline" style={{position: 'relative'}}>
          <img src="/assets/scorebook/icon-star.png" style={{position: 'absolute', top: '-8px', right: '-22px', transform: 'rotate(-22deg)', height: '21px', width: '21px'}} />
          <img src="/assets/scorebook/icon-star.png" style={{position: 'absolute', top: '-11px', right: '-7px', transform: 'rotate(-34deg)', height: '10px', width: '10px'}} />
          <h3>Two New Writing Tools</h3>
        </div>

        <div>
          <a href='/tools/diagnostic' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '8px'}}><div className="activate-tooltip icon-wrapper icon-diagnostic-black" data-original-title="" title=""></div><p style={{fontWeight: 'bold', fontSize: '18px', margin: '8px 0'}}>Quill Diagnostic</p></a>
          <a href='/tools/connect' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div className="activate-tooltip icon-wrapper icon-connect-black" data-original-title="" title=""></div><p style={{fontWeight: 'bold', fontSize: '18px', margin: '8px 0'}}>Quill Connect</p></a>
        </div>
          <p style={{padding: '0px 15px', marginTop: '12px'}}>Use our new tools to assess your students’ writing and build sentence structure skills.</p>
          <a href='/tools/diagnostic'><button style={{marginTop: '18px'}} className="button button-white beta">Learn More</button></a>
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
