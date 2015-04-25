var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Models.ChapterLesson = (function(_super) {
  __extends(ChapterLesson, _super);

  function ChapterLesson() {
    return ChapterLesson.__super__.constructor.apply(this, arguments);
  }

  ChapterLesson.prototype.initialize = function() {
    return this.answers = new PG.Collections.Chunks;
  };

  ChapterLesson.prototype.rule = function() {
    return chapterRules.get(this.attributes.rule_id);
  };

  ChapterLesson.prototype.correct = function(input) {
    return this.answers.any(function(a) {
      return a.text.trim() === input.trim();
    });
  };

  return ChapterLesson;

})(Backbone.Model);