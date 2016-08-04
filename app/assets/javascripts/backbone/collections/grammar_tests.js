var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.GrammarTests = (function(_super) {
  __extends(GrammarTests, _super);

  function GrammarTests() {
    return GrammarTests.__super__.constructor.apply(this, arguments);
  }

  GrammarTests.prototype.model = PG.Models.GrammarTest;

  return GrammarTests;

})(Backbone.Collection);

window.grammarTests = new PG.Collections.GrammarTests;