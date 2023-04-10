"use strict";
import React from 'react';

export default class LoadingIndicator extends React.Component {

  render() {
    return (
      <div className="spinner-container">
        <img alt="loading spinner" className='spinner' src='/images/loader_still.svg' />
      </div>
    );
  }
}
