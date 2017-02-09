'use strict'

 import React from 'react'

 export default React.createClass({

   render: function () {
 		return (
      <div className="row empty-unit-manager">
        <div className="col-xs-7">
          <p>Welcome! This is where your assigned activity packs are stored, but it's empty at the moment.</p>
          <p>Let's add your first activity from the Featured Activity Pack library.</p>
        </div>
        <div className="col-xs-4">
          <button onClick={this.props.switchToExploreActivityPacks} className="button-green create-unit featured-button">Browse Featured Activity Packs</button>
        </div>
      </div>
    )}
})
