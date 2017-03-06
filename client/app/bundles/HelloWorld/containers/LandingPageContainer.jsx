import React from 'react'
import $ from 'jquery'
import LandingPage from '../components/progress_reports/landing_page.jsx'
import LoadingIndicator from '../components/shared/loading_indicator.jsx'


export default React.createClass({

  getInitialState: function(){
    return {loading: true}
  },

  componentDidMount: function(){
    let that = this;
    $.get('/current_user_json', function(data) {
      that.setState({flag: data.flag,loading: false})
    })
  },


  render: function() {
      if (this.state.loading) {
        return <LoadingIndicator/>
      } else {
        return <LandingPage flag={this.state.flag}/>
      }
   }
 });
