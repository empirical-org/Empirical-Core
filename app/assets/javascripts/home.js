var HomeSlideshow,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

HomeSlideshow = (function(_super) {
  __extends(HomeSlideshow, _super);

  function HomeSlideshow() {
    return HomeSlideshow.__super__.constructor.apply(this, arguments);
  }

  HomeSlideshow.prototype.initialize = function() {
    _.bindAll(this, 'next');
    return this.interval = setInterval(this.next, 5000);
  };

  HomeSlideshow.prototype.next = function() {
    var $active, $next, index;
    $active = this.$('.content.active');
    index = this.$('.content').index($active);
    $('.content').removeClass('disabled');
    $next = this.$('.content').length === index + 1 ? this.$('.content:eq(0)') : this.$(".content:eq(" + (index + 1) + ")");
    $active.removeClass('active');
    $next.addClass('active');
    return setTimeout((function() {
      return $next.siblings().addClass('disabled');
    }), 500);
  };

  return HomeSlideshow;

})(Backbone.View);

jQuery(function($) {
  var el;
  if ((el = $('#apDiv5')).length > 0) {
    new HomeSlideshow({
      el: el
    });
  }
  return $('.nav').on('click', 'li.dropdown.open > a', function(e) {
    return window.location = $(e.target).closest('li').find('ul a:first').prop('href');
  });
});