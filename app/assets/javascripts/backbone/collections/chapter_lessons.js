var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.ChapterLessons = (function(_super) {
  __extends(ChapterLessons, _super);

  function ChapterLessons() {
    return ChapterLessons.__super__.constructor.apply(this, arguments);
  }

  ChapterLessons.prototype.model = PG.Models.ChapterLesson;

  return ChapterLessons;

})(Backbone.Collection);