'use strict'
import React from 'react'
import createReactClass from 'create-react-class';
import DatePicker from 'react-datepicker';
import moment from 'moment';



 export default createReactClass({
    // displayName: 'Example',

    getInitialState: function() {
        return {startDate: moment()};
    },

    handleChange: function(date) {
        this.setState({startDate: date});
    },

    render: function() {
        return <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>;
    }
});
