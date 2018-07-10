import React from 'react'

export default React.createClass({

 miniBuilder: function() {
   return (
     <div className='best-practices-container' onClick={() => window.location = "http://support.quill.org/general-questions/teacher-stories-how-to-best-use-quill-tools-with-your-students"}>
       <h4>Teacher Best Practices</h4>
         <img src='https://assets.quill.org/images/photos/teacher_resources.jpg'></img>
       <p>Read stories of how teachers have successfully used Quill with their students.</p>
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
