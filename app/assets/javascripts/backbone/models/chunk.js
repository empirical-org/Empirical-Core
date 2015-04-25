var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

PG.Models.Chunk = (function(_super) {
  __extends(Chunk, _super);

  function Chunk() {
    return Chunk.__super__.constructor.apply(this, arguments);
  }

  Chunk.prototype.initialize = function(options) {
    this.word = options.word;
    this.error = options.error;
    this.answer = options.answer;
    this.grammar = options.grammar;
    return this.text = options.text;
  };

  Chunk.prototype.grade = function() {
    if (this.inputPresent() && this.correct() === this.input) {
      return true;
    } else if (!this.inputPresent() && this.word) {
      return true;
    } else {
      return false;
    }
  };

  Chunk.prototype.correct = function() {
    if (this.answer) {
      return this.answer;
    } else {
      return this.word;
    }
  };

  Chunk.prototype.inputPresent = function() {
    return _.isString(this.input) && (this.input !== this.word);
  };

  Chunk.prototype.wordDif = function(dir) {
    return diffString(this.input || this.error, this.correct());
  };

  Chunk.prototype.rule = function() {
    return chapterRules.get(this.grammar);
  };

  Chunk.prototype.css_class = function() {
    var extra;
    extra = $.trim(this.correct()) === '' || $.trim(this.correct()) === '<br>' ? ' non-editable' : '';
    return "edit-word" + extra;
  };

  Chunk.prototype.toJSON = function() {
    var json;
    return json = {
      word: this.word,
      error: this.error,
      answer: this.answer,
      grammar: this.grammar,
      text: this.text,
      input: this.input,
      id: this.attributes.id
    };
  };

  return Chunk;

})(Backbone.Model);