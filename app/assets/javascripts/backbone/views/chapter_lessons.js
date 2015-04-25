var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Views.ChapterLessons = (function(_super) {
  __extends(ChapterLessons, _super);

  function ChapterLessons() {
    return ChapterLessons.__super__.constructor.apply(this, arguments);
  }

  ChapterLessons.prototype.events = {
    'click .submit': 'showResults',
    'click .home': 'goHome'
  };

  ChapterLessons.prototype.initialize = function(options) {
    $('.incorrect').hide();
    $('.home').hide();
    return chapterScore.setMissed(options.percentMissed);
  };

  ChapterLessons.prototype.showResults = function() {
    var percentCompleted;
    _.each(this.$('.lesson'), (function(_this) {
      return function(lessenEl) {
        var $lesson, thisLesson;
        $lesson = $(lessenEl);
        thisLesson = chapterLessons.get($lesson.data('id'));
        if (thisLesson.correct($lesson.find('.input').val())) {
          $lesson.removeClass('error');
          return $lesson.addClass('success');
        } else {
          $lesson.addClass('error');
          $lesson.find('.form').hide();
          return $lesson.find('.incorrect').show();
        }
      };
    })(this));
    $('.submit').hide();
    percentCompleted = $('.lesson.success').length / $('.lesson').length * 100;
    chapterScore.setCompleted(percentCompleted);
    return chapterScore.save({
      user_id: chapterScore.user_id,
      assignment_id: chapterScore.assignment_id,
      items_missed: chapterScore.items_missed,
      lessons_completed: chapterScore.lessons_completed
    }, {
      error: function() {
        return console.log("Error");
      },
      success: function() {
        return $('.home').show();
      }
    });
  };

  ChapterLessons.prototype.goHome = function() {
    return document.location.href = '/profile';
  };

  return ChapterLessons;

})(Backbone.View);