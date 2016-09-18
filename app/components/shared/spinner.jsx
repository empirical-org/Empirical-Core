import React from 'react'
import spinner from '../../img/loader_still.svg';
export default React.createClass({

  render: function () {
    return (
      <div className="loading-spinner">
        <div className="spinner-container">
          <img className='spinner' src={spinner}/>
        </div>
      </div>
    )
  },

})
