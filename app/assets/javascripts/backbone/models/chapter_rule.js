var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Models.ChapterRule = (function(_super) {
  __extends(ChapterRule, _super);

  function ChapterRule() {
    return ChapterRule.__super__.constructor.apply(this, arguments);
  }

  ChapterRule.prototype.initialize = function() {
    return this.lessons = new PG.Collections.ChapterLessons;
  };

  return ChapterRule;

})(Backbone.Model);