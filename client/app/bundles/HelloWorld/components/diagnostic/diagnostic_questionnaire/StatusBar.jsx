'use strict'
import React from 'react'

export default React.createClass({

    checkpointBuilder: function(stage, index, green, current) {
        return (
            <div key={index*-1-20} className={'check-point green-' + green}>
                {this.checkOrNum(current, index, green)}
                <div className='check-point-type'>
                    <span id={stage}>{stage}</span>
                </div>
            </div>
        )
    },

    checkOrNum: function(current, index, green) {
      if (!current && green) {
        return <img src={`${process.env.CDN_URL}/images/shared/check_icon.svg`} alt='checked'/>
      } else {
        return  <span>{index + 1}</span>
      }
    },

    connectorLineBuilder: function(green, index) {
        return (
            <div key={index} className={'connector-line green-' + green}></div>
        )
    },

    checkpoints: function() {
        let stages = ['Introduction', 'Preview', 'Assign']
        let mappedStages = []
        stages.forEach((stage, index) => {
            let green = index <= Number(this.props.stage) - 1
            let current = index === Number(this.props.stage) - 1
            mappedStages.push(this.checkpointBuilder(stage, index, green, current))
            if (index < stages.length - 1) {
              let green = index < Number(this.props.stage) - 1
                mappedStages.push(this.connectorLineBuilder(green, index))
            }
        })
        return mappedStages;
    },

    render: function() {
        return (
            <div id='status-bar-wrapper'>
                <div id='diagnostic-icon-section'>
                    <img id='diagnostic-icon' src={`${process.env.CDN_URL}/images/shared/diagnostic_icon.svg`} alt="diagnostic_icon"/>
                    <span>Sentence Structure</span><br/><span>Diagnostic</span>
                </div>
                <div id="checkpoint-wrapper">
                  <div id='status-bar'>
                      {this.checkpoints()}
                  </div>
                </div>
            </div>
        );
    }

});
