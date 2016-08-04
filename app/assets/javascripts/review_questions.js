var ReviewQuestion,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

ReviewQuestion = (function(_super) {
  __extends(ReviewQuestion, _super);

  function ReviewQuestion() {
    return ReviewQuestion.__super__.constructor.apply(this, arguments);
  }

  ReviewQuestion.prototype.events = {
    'submit form': 'showResult'
  };

  ReviewQuestion.prototype.showResult = function(e) {
    var answer, option, _i, _len, _ref;
    e.preventDefault();
    answer = this.$('textarea').val();
    _ref = this.$el.data('answer_keywords').split(/\s+/);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      option = _ref[_i];
      if (answer.match(option)) {
        return this.message('success', 'That\'s correct');
      }
    }
    return this.message('error', 'Sorry, please try again.');
  };

  ReviewQuestion.prototype.message = function(type, message) {
    this.$('.message').html('');
    this.$('.message').append("<div class=\"" + type + "\">\n  " + message + "\n</div>");
    return true;
  };

  return ReviewQuestion;

})(Backbone.View);

jQuery(function($) {
  var el, reviewQuestions, _i, _len, _results;
  if ((reviewQuestions = $('.review-question')).length > 0) {
    _results = [];
    for (_i = 0, _len = reviewQuestions.length; _i < _len; _i++) {
      el = reviewQuestions[_i];
      _results.push(new ReviewQuestion({
        el: el
      }));
    }
    return _results;
  }
});