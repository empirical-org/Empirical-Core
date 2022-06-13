/*
component must have the following API -

.setState (as any React component should)
.state.is_last_page
.state.currentPage
.state.loading
.fetchData()

*/
'use strict';

import _ from 'underscore'
import $ from 'jquery'
export default function () {

  let _scrollComputation = function (selector, component) {
    let y = $(selector).height();
    let w = 1/(component.state.currentPage + 1);
    let z = y*(1 - w);
    return z;
  };

  let _loadMore = function (component) {
    component.fetchData();
  };

  this.scrollify = function (selector, component) {
    $(window).scroll(function (e) {
      if (($(window).scrollTop() + document.body.clientHeight) > (_scrollComputation(selector, component) )) {
        if (!component.state.loading && !component.state.is_last_page) {
          _loadMore(component);
        }
      }
    });
  };
}
