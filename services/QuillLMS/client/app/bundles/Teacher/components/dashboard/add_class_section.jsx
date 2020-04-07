'use strict'
 import React from 'react'

 export default class extends React.Component {
   render() {
     return (
       <a href='/teachers/classrooms?modal=create-a-class'>
         <div className="dashed">
           <img className='plus-icon' src='/add_class.png' />
           <h3>Add a Class</h3>
         </div>
       </a>
     );
   }
 }
