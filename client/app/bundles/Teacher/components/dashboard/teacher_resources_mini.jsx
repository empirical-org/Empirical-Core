'use strict'

 import React from 'react'

 export default React.createClass({

  miniBuilder: function() {
    return (
      <div className='resources-container' onClick={() => window.location = '/teacher_resources'}>
        <h4>Teacher Resources</h4>
          <img src='/teacher_resources_icons.png'></img>
        <p>Introduce fellow educators to Quill with presentations, guides, and videos.</p>
      </div>
    );
  },

  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>
    );
  }
});
