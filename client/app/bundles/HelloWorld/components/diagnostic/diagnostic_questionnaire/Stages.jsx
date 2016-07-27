'use strict'

import React from 'react'
import ClassroomPage from './ClassroomPage.jsx'
import IntroPage from './IntroPage.jsx'

export default React.createClass({

  render: function() {
    console.log('in stage!')
    return (
      <div className='diagnostic-planner-body'>
       <ClassroomPage/>
     </div>
    );
   }
 });
