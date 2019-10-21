;

import React from 'react';

export default React.createClass({

   miniBuilder() {
    return (
      <div className='resources-container' onClick={() => window.location = '/teacher_resources'}>
        <h4>Teacher Center</h4>
        <img src='/teacher_resources_icons.png' />
        <p>Introduce fellow educators to Quill with presentations, guides, and videos.</p>
      </div>
    );
  },

   render() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
        <div className="mini_content">
          {this.miniBuilder()}
        </div>
      </div>
    );
  },
 });
