"use strict";
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <div className="spinner-container">
        <img className='spinner' src='/images/loader_still.svg' />
      </div>
    );
  }
}
