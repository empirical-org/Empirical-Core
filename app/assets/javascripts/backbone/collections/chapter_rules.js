var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.ChapterRules = (function(_super) {
  __extends(ChapterRules, _super);

  function ChapterRules() {
    return ChapterRules.__super__.constructor.apply(this, arguments);
  }

  ChapterRules.prototype.model = PG.Models.ChapterRule;

  return ChapterRules;

})(Backbone.Collection);