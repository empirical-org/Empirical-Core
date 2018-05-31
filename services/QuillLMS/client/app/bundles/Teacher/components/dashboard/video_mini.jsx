'use strict'

 import React from 'react'

 export default React.createClass({

  embedCodeGenerator: function() {
    var videoCode = this.props.videoCode
    var fullEmbedCode = videoCode + '?&theme=light&autohide=2&showinfo=0'
    return (
      <div className='video-container'>
        <h4>Building Better Writers</h4>
        <iframe width='298' height='168' src={fullEmbedCode} frameBorder="0" allowFullScreen></iframe>
        <p>An overview of how Quill works.</p>
      </div>
);
},


  render: function() {
    return (
      <div className={"mini_container  col-md-4 col-sm-5 text-center"}>
        <div className ={"mini_content"}>
          {this.embedCodeGenerator()}
        </div>
      </div>
    );
  }
});
