import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';

class SelectSchoolType extends Component {
  render() {
    return (
      <div className='educator-type'>
        <h3>Are you a faculty member at a U.S. K-12 school?*</h3>
         <div className='option-wrapper'>
          <Link to="/sign-up/add-k12">
            <button className='button-green'>
              Yes
            </button>
          </Link>
          <Link to="/sign-up/add-non-k12">
            <button className='button-green'>
              No
            </button>
          </Link>
         </div>
         <div>
           *K-12 is a term for school grades prior to college.<br/>
           These grades span from kindergarten through the 12th grade.
         </div>
      </div>
    );
  }
}

export default SelectSchoolType
