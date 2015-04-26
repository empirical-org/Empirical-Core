ReviewQuestion = Backbone.View.extend({
  events: {
    'submit form': 'showResult'
  },

  showResult: function (e) {
    e.preventDefault();
    var answer = this.$('textarea').val();

    this.$el.data('answer_keywords').split(/\s+/).forEach(function (option) {
      if (answer.match(option)) {
        return this.message('success', "That's correct");
      }
    });

    return this.message('error', 'Sorry, please try again.');
  },

  message: function (type, message) {
    this.$('.message').html('');

    var messageDiv = $('<div>').addClass(type).html(message);
    this.$('.message').append(messageDiv);

    return true;
  }
});

jQuery(function ($) {
  var reviewQuestions = $('.review-question')
  if (reviewQuestions.length > 0) {
    reviewQuestions.forEach(function (el) {
      new ReviewQuestion({ el });
    });
  }
});
