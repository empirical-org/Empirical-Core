'use strict'
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';



 export default class extends React.Component {
     // displayName: 'Example',

     state = {startDate: moment()};

     handleChange = (date) => {
         this.setState({startDate: date});
     };

     render() {
         return <DatePicker onChange={this.handleChange} selected={this.state.startDate} />;
     }
 }
