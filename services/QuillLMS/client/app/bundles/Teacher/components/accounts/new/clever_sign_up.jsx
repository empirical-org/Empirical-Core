'use strict';
import $ from 'jquery'
import React from 'react'

export default React.createClass({
  getInitialState: function () {
    return {
      redirectUri: null,
      clientId: null,
      cleverScope: null,
      detailsLoaded: false,
      notAvailable: false
    };
  },

  componentDidMount: function () {
    var that = this;
    $.get('/clever/auth_url_details')
      .then(this.loadState, this.failure)
  },

  loadState: function (data) {
    this.setState({
      redirectUri: data.redirect_uri,
      clientId: data.client_id,
      cleverScope: data.clever_scope,
      detailsLoaded: true
    });
  },

  failure: function () {
    this.setState({notAvailable: true});
  },

  buildLink: function () {
    var link;
    if (this.state.detailsLoaded) {
      var base, scope, redirectUri, clientId;
      base = "https://clever.com/oauth/authorize?response_type=code";
      scope = "&scope=" + encodeURIComponent(this.state.cleverScope);
      redirectUri = "&redirect_uri=" + encodeURIComponent(this.state.redirectUri);
      clientId = "&client_id=" + encodeURIComponent(this.state.clientId);
      link = base + scope + redirectUri + clientId;
    } else {
      link = "";
    }
    return link;
  },

  render: function () {
    var result;
    if (this.state.notAvailable) {
      result = <span></span>;
    } else {
      result = (<button className='clever-sign-up' onClick={() => window.location = this.buildLink()}>
        <img src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`}/>
        <span>Sign up with Clever</span>
      </button>)
    }
    return result;
  }
});
