'use strict'
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import $ from 'jquery'
import Pluralize from 'pluralize'
import LoadingIndicator from '../../shared/loading_indicator.jsx'
export default createReactClass({
    propTypes: {
        title: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        bodyText: PropTypes.string.isRequired,
        directions: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        timeDuration: PropTypes.string.isRequired,
        toggleTab: PropTypes.func,
        toggleTarget: PropTypes.string,
        routeToGetQuantity: PropTypes.string,
        quantity: PropTypes.number
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
