import React from 'react'
const spinner = 'https://assets.quill.org/images/icons/loader_still.svg';
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
