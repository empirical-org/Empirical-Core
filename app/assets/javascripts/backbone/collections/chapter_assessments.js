var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.ChapterAssessments = (function(_super) {
  __extends(ChapterAssessments, _super);

  function ChapterAssessments() {
    return ChapterAssessments.__super__.constructor.apply(this, arguments);
  }

  ChapterAssessments.prototype.model = PG.Models.ChapterAssessment;

  return ChapterAssessments;

})(Backbone.Collection);