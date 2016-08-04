var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Models.GrammarRule = (function(_super) {
  __extends(GrammarRule, _super);

  function GrammarRule() {
    return GrammarRule.__super__.constructor.apply(this, arguments);
  }

  GrammarRule.prototype.initialize = function() {
    return this.chunks = new PG.Collections.Chunks;
  };

  GrammarRule.prototype.results = function() {
    return this.chunks.reject(function(chunk) {
      return chunk.grade();
    });
  };

  GrammarRule.prototype.correct = function() {
    return this.chunks.map(function(c) {
      return c.correct();
    }).join(' ');
  };

  return GrammarRule;

})(Backbone.Model);