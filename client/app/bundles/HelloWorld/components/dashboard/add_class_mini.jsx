'use strict'
 import React from 'react'

 export default React.createClass({
  render: function() {
    return (
      <div className={"mini_container col-md-4 col-sm-5 text-center"}>
      <div className={"mini_content"}>
          <a className='add_class_link' href="/teachers/classrooms/new">
            <img className='plus_icon' src='/add_class.png'></img>
            <h3>Add a Class</h3>
          </a>
        </div>
      </div>
    );
  }

});
