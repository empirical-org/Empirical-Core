'use strict'
import React from 'react'
import $ from 'jquery'
import Pluralize from 'pluralize'
import LoadingIndicator from '../../shared/loading_indicator.jsx'
export default React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        img: React.PropTypes.string.isRequired,
        bodyText: React.PropTypes.string.isRequired,
        directions: React.PropTypes.string.isRequired,
        unit: React.PropTypes.string.isRequired,
        timeDuration: React.PropTypes.string.isRequired,
        toggleTab: React.PropTypes.func,
        toggleTarget: React.PropTypes.string,
        routeToGetQuantity: React.PropTypes.string,
        quantity: React.PropTypes.number
    },

    getInitialState: function(){
      return {count: null}
    },

    componentDidMount: function() {
      this.quantity();
    },

    quantity: function() {
      if (this.props.routeToGetQuantity) {
        var that = this;
        that.ajax = {};
        that.ajax.quantity = $.ajax({url: this.props.routeToGetQuantity})
          .done(function(data) {
              that.setState({count: data.count, loading: false});
          });
      }
    },

    componentWillUnmount: function() {
      if (this.ajax && this.ajax.quantity){
        this.ajax.quantity.abort()
      }
    },

    render: function() {
        var unit = this.props.unit;
        let count = (this.props.quantity || this.state.count);
        let countCopy;
        if (count) {
          countCopy = count + ' ' + Pluralize(unit, count)
        }
        return (
          <div className='assignment-type-mini' key={this.props.title} onClick={() => window.location = this.props.link}>
            <h3>{this.props.title}</h3>
            <img src={this.props.img} alt="assignment-type-image"/>
            <p className='overview'>{this.props.bodyText}</p>
            <div className='meta-info-wrapper'>
                <span className='directions'>{this.props.directions}</span>
                <br/> {(countCopy || 'Calculating') + '  |  ' + this.props.timeDuration + ' ' + 'per ' + unit}
            </div>
          </div>
      )
    }
})
