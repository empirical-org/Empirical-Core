var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Views.GrammarLessons = (function(_super) {
  __extends(GrammarLessons, _super);

  function GrammarLessons() {
    return GrammarLessons.__super__.constructor.apply(this, arguments);
  }

  GrammarLessons.prototype.events = {
    'click .submit': 'showResults'
  };

  GrammarLessons.prototype.showResults = function() {
    return _.each(this.$('.lesson'), (function(_this) {
      return function(lessenEl) {
        var $lesson, rule;
        $lesson = $(lessenEl);
        rule = grammarRules.get($lesson.data('id'));
        if (rule.correct().trim() === $lesson.find('.input').val().trim()) {
          $lesson.removeClass('error');
          return $lesson.addClass('success');
        } else {
          return $lesson.addClass('error');
        }
      };
    })(this));
  };

  return GrammarLessons;

})(Backbone.View);