'use strict'

import React from 'react'

export default React.createClass({

  render: function(){
      return (
        <div className='educator-type'>
          <h3>Which type of Educator are you?</h3>
           <div className='option-wrapper non-us'>
             <button className='button-green' onClick={() => this.props.selectSchool('home school')}>Home School</button>
             <button className='button-green' onClick={() => this.props.selectSchool('us higher ed')}>U.S Higher Ed</button>
             <button className='button-green' onClick={() => this.props.selectSchool('international')}>International</button>
             <button className='button-green' onClick={() => this.props.selectSchool('other')}>Other</button>
           </div>
        </div>
      );
    }
});
