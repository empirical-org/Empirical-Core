var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Collections.Chunks = (function(_super) {
  __extends(Chunks, _super);

  function Chunks() {
    return Chunks.__super__.constructor.apply(this, arguments);
  }

  Chunks.prototype.model = PG.Models.Chunk;

  return Chunks;

})(Backbone.Collection);