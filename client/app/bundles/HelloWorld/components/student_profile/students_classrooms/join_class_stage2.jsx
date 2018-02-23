import React from 'react'
import createReactClass from 'create-react-class'


export default createReactClass({

  render: function() {
    return (
      <div className='additional-class stage-2 text-center'>
        <h1>Classroom Added!</h1>
        <a href='/' className='button-green btn'>Return to Your Profile</a>
      </div>
    );
  }

});
