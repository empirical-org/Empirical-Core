'use strict'
import React from 'react'

export default React.createClass({

    checkpointBuilder: function(stage, index, completed) {
        return (
            <div className={'check-point completed-' + completed}>
                <span>{index + 1}</span>
                <div className='check-point-type'>
                    <span>{stage}</span>
                </div>
            </div>
        )
    },

    connectorLineBuilder: function(completed) {
        return (
            <div className={'connector-line completed-' + completed}></div>
        )
    },

    checkpoints: function() {
        let stages = ['Introduction', 'Preview', 'Assign']
        let mappedStages = []
        stages.forEach((stage, index) => {
            let completed = index < Number(this.props.stage) - 1
            mappedStages.push(this.checkpointBuilder(stage, index, completed))
            if (index < stages.length - 1) {
                mappedStages.push(this.connectorLineBuilder(completed))
            }
        })
        return mappedStages;
    },

    render: function() {
        return (
            <div id='status-bar-wrapper'>
                <div>
                    <img src="images/diagnostic_icon.svg" alt="diagnostic_icon"/>
                    <span>Entry Diagnostic</span>
                </div>
                <div id='status-bar'>
                    {this.checkpoints()}
                </div>
            </div>
        );
    }

});
