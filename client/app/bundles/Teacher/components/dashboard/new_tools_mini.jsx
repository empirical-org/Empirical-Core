'use strict'

 import React from 'react'

 export default React.createClass({

  miniBuilder: function() {
    return (
      <div className="mini_content">
        <div className="gray-underline" style={{position: 'relative'}}>
          <img src="/assets/icons/icon-star.svg" style={{position: 'absolute', top: '-11px', right: '-22px', transform: 'rotate(-22deg)', height: '27px', width: '27px'}} />
          <img src="/assets/icons/icon-star.svg" style={{position: 'absolute', top: '-11px', right: '-3px', transform: 'rotate(-34deg)', height: '14px', width: '14px'}} />
          <h3>Two New Writing Tools</h3>
        </div>

        <div>
          <a href='/tools/diagnostic' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '8px'}}><img src="/images/icon-diagnostic-black.svg" style={{height: '25px', marginRight: '10px', marginTop: '3px'}} /><p style={{fontWeight: 'bold', fontSize: '18px', margin: '8px 0'}}>Quill Diagnostic</p></a>
          <a href='/tools/connect' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><img src="/images/icon-connect-black.svg" style={{height: '26px', marginRight: '10px'}} /><p style={{fontWeight: 'bold', fontSize: '18px', margin: '8px 0'}}>Quill Connect</p></a>
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
