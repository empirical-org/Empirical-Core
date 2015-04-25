var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Models.GrammarTest = (function(_super) {
  __extends(GrammarTest, _super);

  function GrammarTest() {
    return GrammarTest.__super__.constructor.apply(this, arguments);
  }

  GrammarTest.prototype.initialize = function() {
    return this.chunks = new PG.Collections.Chunks;
  };

  GrammarTest.prototype.results = function() {
    return this.chunks.reject(function(chunk) {
      return chunk.grade();
    });
  };

  GrammarTest.prototype.back = function(chunk) {
    var cap, cur, front;
    front = '';
    cur = chunk.id;
    cap = 5;
    while (cur) {
      cur--;
      cap--;
      if (cap < 1) {
        break;
      }
      front = this.chunks.at(cur).correct() + ' ' + front;
    }
    return front;
  };

  GrammarTest.prototype.front = function(chunk) {
    var back, cap, cur;
    back = '';
    cur = chunk.id;
    cap = 5;
    while (cur < (this.chunks.length - 1)) {
      cur++;
      cap--;
      if (cap < 1) {
        break;
      }
      back = back + ' ' + this.chunks.at(cur).correct();
    }
    return back;
  };

  return GrammarTest;

})(Backbone.Model);