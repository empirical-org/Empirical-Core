'use strict'

import React from 'react'
import {Router, Route, Link, hashHistory} from 'react-router'
import NavBar from './nav_bar.jsx'
import $ from 'jquery'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')

export default React.createClass({

	getInitialState: function() {
		return ({loading: true, classrooms: null})
	},

	componentDidMount: function() {
		this.ajaxCalls();
	},

	componentWillUnmount: function() {
		let ajax = this.ajax;
		for (var call in ajax) {
			if (ajax.hasOwnProperty(call)) {
				call.abort();
			}
		}
	},

	ajaxCalls: function() {
		this.ajax = {};
		let ajax = this.ajax;
		let that = this;
		ajax.classrooms = $.get('/teachers/classrooms/classrooms_i_teach', function(data) {
			that.setState({classrooms: data.classrooms, loading: false});
		});
	},


  render: function() {
		if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return (
				<div id='diagnostic-planner-reports'>
					<NavBar classrooms={this.state.classrooms}>
						{this.props.children}
					</NavBar>
				</div>
      );
	}}

});
