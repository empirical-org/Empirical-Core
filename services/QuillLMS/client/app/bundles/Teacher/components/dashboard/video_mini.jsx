'use strict'

 import React from 'react'

 export default class extends React.Component {
   embedCodeGenerator = () => {
     var videoCode = this.props.videoCode
     var fullEmbedCode = videoCode + '?&theme=light&autohide=2&showinfo=0'
     return (
       <div className='video-container'>
         <h4>Building Better Writers</h4>
         <iframe allowFullScreen frameBorder="0" height='168' src={fullEmbedCode} width='298' />
         <p>An overview of how Quill works.</p>
       </div>
 );
 };

   render() {
     return (
       <div className={"mini_container  col-md-4 col-sm-5 text-center"}>
         <div className={"mini_content"}>
           {this.embedCodeGenerator()}
         </div>
       </div>
     );
   }
 }
