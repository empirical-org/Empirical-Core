import React from 'react'

export default React.createClass({

  render: function() {
    return (
      <div className="mini_container results-overview-mini-container col-md-4 col-sm-5 text-center">
        <div className="mini_content">
          <div className="gray-underline">
            <h3>You Have Beta Access!</h3>
          </div>
          <p>You have been granted beta access to Quill. You now have early access to our new content and tools.</p>
          <a href='http://support.quill.org/activities-implementation/quill-lessons/how-can-i-assign-and-launch-quill-lessons-activities-with-my-students'><button className="button button-white beta">Learn More</button></a>
        </div>
      </div>
    );
   }
 });
