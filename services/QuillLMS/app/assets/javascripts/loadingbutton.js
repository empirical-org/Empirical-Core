/*
 * Button loading plugin that appends a container
 * and positions a css styled loading animator around a given button
 */
(function ( $ ) { // This extends JQuery with the function loadingButton
  $.fn.loadingButton = function() {
    let loadingSpinnerClass = 'loading-spinner',
      container = this,
      parent = {};

    this.addClass('loading-btn');
    $('body').append('<span class="' + loadingSpinnerClass + '"></span>');
    let buttonPosition = this.offset();

    // buttonPosition.left + 40 --->  Hackey centering but it works for now.
    $('.' + loadingSpinnerClass).css('left', buttonPosition.left + 40).css('top', buttonPosition.top);
    return this;
  };
}(jQuery));

(function ( $ ) {
  $.fn.removeLoadingButton = function() {
    let loadingSpinnerClass = 'loading-spinner',
      container = this,
      parent = {};

    this.removeClass('loading-btn');
    $('.loading-spinner').remove();
    return this;
  };
}(jQuery));

$(document).ready(function(){
  $('a.button').on('click', function (){
    $(this).loadingButton();
  });
});
