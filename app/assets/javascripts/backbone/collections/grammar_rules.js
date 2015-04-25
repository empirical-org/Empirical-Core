var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.GrammarRules = (function(_super) {
  __extends(GrammarRules, _super);

  function GrammarRules() {
    return GrammarRules.__super__.constructor.apply(this, arguments);
  }

  GrammarRules.prototype.model = PG.Models.GrammarRule;

  return GrammarRules;

})(Backbone.Collection);

window.grammarRules = new PG.Collections.GrammarRules;