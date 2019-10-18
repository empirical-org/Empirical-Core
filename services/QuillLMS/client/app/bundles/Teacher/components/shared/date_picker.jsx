'use strict'
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';



 export default React.createClass({
    // displayName: 'Example',

    getInitialState: function() {
        return {startDate: moment()};
    },

    handleChange: function(date) {
        this.setState({startDate: date});
    },

    render: function() {
        return <DatePicker onChange={this.handleChange} selected={this.state.startDate} />;
    }
});
