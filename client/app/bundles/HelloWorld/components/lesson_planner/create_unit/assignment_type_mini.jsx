'use strict'
import React from 'react'
import $ from 'jquery'
export default React.createClass({
    propTypes: {
        toggleTab: React.PropTypes.func.isRequired,
        toggleTarget: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        img: React.PropTypes.string.isRequired,
        bodyText: React.PropTypes.string.isRequired,
        directions: React.PropTypes.string.isRequired,
        routeToGetQuantity: React.PropTypes.string.isRequired,
        unit: React.PropTypes.object.isRequired,
        timeDuration: React.PropTypes.string.isRequired,
    },

    getInitialState: function(){
      return {quantity: null}
    },

    componentDidMount: function() {
        this.quantity();
    },

    quantity: function() {
      var that = this;
      $.ajax({url: this.props.routeToGetQuantity})
        .done(function(data) {
            that.setState({count: data.count});
        });
    },

    changeView: function() {
      this.props.toggleTab(this.props.toggleTarget);
    },

    render: function() {
        var unit = this.props.unit;
        return (<div className='assignment-type-mini' key={this.props.title} onClick={this.changeView}>
            <h3>{this.props.title}</h3>
            <img src={this.props.img} alt="assignment-type-image"/>
            <p className='overview'>{this.props.bodyText}</p>
            <div className='meta-info-wrapper'>
                <span className='directions'>{this.props.directions}</span>
                <br/> {this.state.count + ' ' + unit.plural + '  |  ' + this.props.timeDuration + ' ' + 'per ' + unit.singular.charAt(0).toUpperCase() + unit.singular.slice(1)}
            </div>
        </div>)
    }
})
