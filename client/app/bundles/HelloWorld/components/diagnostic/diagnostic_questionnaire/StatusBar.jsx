'use strict'
import React from 'react'

export default React.createClass({


    render: function() {
        return (
            <div id='status-bar-wrapper'>
                <div>
                    <img src="images/diagnostic_icon.svg" alt="diagnostic_icon"/>
                    <span>Entry Diagnostic</span>
                </div>
                <div id='status-bar'>
                    <div className='check-point'>
                        <span>1</span>
                        <div className='check-point-type'>
                            <span>Introduction</span>
                        </div>
                    </div>
                    <div className='connector-line'></div>
                    <div className='check-point'>
                        <span>2</span>
                        <div className='check-point-type'>
                          <span>Preview</span>
                        </div>
                    </div>
                    <div className='connector-line'></div>
                    <div className='check-point'>
                        <span>3</span>
                        <div className='check-point-type'>
                            <span>Assign</span>
                        </div>
                    </div>
                </div>
            </div>
          );
        }

      });
