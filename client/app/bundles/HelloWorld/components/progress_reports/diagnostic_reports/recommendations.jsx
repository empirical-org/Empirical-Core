import React from 'react'

export default React.createClass({

  render: function () {
    return (
      <div>
        <p className="recommendations-explanation">
          Based on the results of the diagnostic, we created a personalized learning plan for each student.
          <br/>Customize your learning plan by selecting the activity packs you would like to assign.
        </p>
        <div className="recommendations-container">
          <div className="recommendations-top-bar">
            <div className="recommendations-key">
              <div className="recommendations-key-icon">

              </div>
              <p>Recommended Activity Packs</p>
            </div>
            <div className="recommendations-assign-button" onClick={() => alert("Assigning") }>
              <span>Assign Activity Packs</span>
            </div>
          </div>
        </div>
      </div>
    )
  },

})
