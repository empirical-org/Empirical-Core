HomeSlideshow = Backbone.View.extend({

  initialize: function () {
    _.bindAll(this, 'next');
    this.interval = setInterval(this.next, 5000);
  },

  next: function () {
    var $active = this.$('.content.active');
    var index   = this.$('.content').index($active);
    $('.content').removeClass('disabled');

    var $next;
    if (this.$('.content').length === index + 1) {
      $next = this.$('.content:eq(0)');
    } else {
      $next = this.$('.content:eq(' + (index + 1) + ')')
    }

    $active.removeClass('active');
    $next.addClass('active');
    setTimeout(function () {
      $next.siblings().addClass('disabled');
    }, 500)
  }
});

jQuery(function ($) {
  var el = $('#apDiv5').length
  if (el > 0) new HomeSlideshow({ el });

  $('.nav').on('click', 'li.dropdown.open > a', function (e) {
    window.location = $(e.target).closest('li').find('ul a:first').prop('href');
  })
});
