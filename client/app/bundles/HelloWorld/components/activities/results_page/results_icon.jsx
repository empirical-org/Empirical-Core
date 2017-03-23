'use strict'
import React from 'react'
import ScoreColor from '../../modules/score_color.js'

export default React.createClass({

    getInitialState: function() {
        return {scoreColor: this.scoreColor()}
    },

    scoreColor: function() {
        var score = this.props.percentage * 100;
        return ScoreColor(score);
    },

    backgroundColor: function() {
        var scoreColor = this.state.scoreColor;
        var color;
        if (scoreColor === 'red-score-color') {
            color = '#E7522C';
        } else if (scoreColor === 'yellow-score-color') {
            color = '#F6A625';
        } else {
            color = '#5AAF46';
        }
        return {backgroundColor: color};
    },

    fontColor: function() {
        var scoreColor = this.state.scoreColor;
        var color;
        if (scoreColor === 'red-score-color') {
            color = '#82290D';
        } else if (scoreColor === 'yellow-score-color') {
            color = '#79500E';
        } else {
            color = '#305217';
        }
        return {color: color};
    },

    imageSrc: function() {
        let img;
        switch (this.props.activityType) {
            case 'diagnostic':
                img = 'diagnostic_results_icon.svg'
                break
            case 'connect':
                img = 'connect_icon.svg'
                break;
            case 'sentence':
                img = 'grammar_results_icon.png'
                break;
            default:
                img = 'proofreader_results_icon.png'
        }
        return `/images/${img}`
    },

    render: function() {
        // insert below line if we decide we want to reinclude score
        // <h3 style={this.fontColor()}>{Math.round(this.props.percentage * 100) + '%'}</h3>
        return (
            <div className='icon' style={this.backgroundColor()}>
                <div>
                    <img src={this.imageSrc()} alt='activity-type'/>
                </div>
            </div>
        )

    }

});
