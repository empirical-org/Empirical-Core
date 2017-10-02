import Tabslet from 'tabslet';
import $ from 'jquery';

require('../../assets/styles/home.scss');
require('./bootstrap_carousel.js');

document.onreadystatechange = function () {
  const state = document.readyState;
  if (state == 'interactive') {
    console.log('init');
  } else if (state == 'complete') {
    $('tabs-teacher-stories').tabslet({
      autorotate: true,
      delay: 10000,
      pauseonhover: true,
      animation: true,
      active: 1,
    });

    $('.tabs-testimonials').tabslet({
      autorotate: true,
      delay: 10000,
      pauseonhover: false,
      animation: true,
      active: 1,
    });
  }
};
