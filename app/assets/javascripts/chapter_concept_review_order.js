var dataLoad, loadSeriesRoots,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

window.ConceptReviewRoot = (function(_super) {
  __extends(ConceptReviewRoot, _super);

  function ConceptReviewRoot() {
    return ConceptReviewRoot.__super__.constructor.apply(this, arguments);
  }

  ConceptReviewRoot.prototype.events = {
    'click .display': 'showEdit',
    'click .save': 'save',
    'click .add': 'addPosition',
    'click .remove': 'removeAnswer'
  };

  ConceptReviewRoot.prototype.field_name = 'concept_position';

  ConceptReviewRoot.prototype.initialize = function() {
    var val, vals, _i, _len;
    vals = JSON.parse(this.$('.hidden input').val());
    if (_.isEmpty(vals)) {
      vals = [" "];
    }
    for (_i = 0, _len = vals.length; _i < _len; _i++) {
      val = vals[_i];
      this.$('.edit .positions').append(this.positionTemplate(val.trim()));
    }
    return this.$('.display').html(this.$('.hidden input').val());
  };

  ConceptReviewRoot.prototype.showEdit = function() {
    this.$('.display').hide();
    return this.$('.edit').show();
  };

  ConceptReviewRoot.prototype.save = function() {
    this.$('.display').show();
    this.$('.edit').hide();
    this.$('.hidden input').val(this.conceptOrderString());
    return this.$('.display').html(this.conceptOrderString());
  };

  ConceptReviewRoot.prototype.addPosition = function() {
    return this.$('.edit .positions').append(this.positionTemplate());
  };

  ConceptReviewRoot.prototype.positionTemplate = function(val) {
    if (val == null) {
      val = "";
    }
    return $("<div class=\"field string concept-position control-group\">\n  <div class=\"controls\">\n    <textarea id=\"chapter_concept_position\" name=\"" + this.field_name + "[]\" size=\"30\" type=\"text\" value=\"\"></textarea>\n    <a href=\"#remove\" class=\"remove\">Remove</a>\n  </div>\n</div>").find('textarea').val(val).end();
  };

  ConceptReviewRoot.prototype.conceptOrderString = function() {
    return JSON.stringify(_.map(this.$('.concept-position textarea'), function(el) {
      return $(el).val();
    }));
  };

  ConceptReviewRoot.prototype.removeAnswer = function(e) {
    return $(e.target).closest('.concept-position').remove();
  };

  return ConceptReviewRoot;

})(Backbone.View);

window.LessonAnswerRoot = (function(_super) {
  __extends(LessonAnswerRoot, _super);

  function LessonAnswerRoot() {
    return LessonAnswerRoot.__super__.constructor.apply(this, arguments);
  }

  LessonAnswerRoot.prototype.initialize = function() {
    LessonAnswerRoot.__super__.initialize.call(this, JSON.parse(this.$('.hidden input').val()));
    _.bindAll('save');
    return this.$el.closest('form').find('.form-actions .btn').on('click', (function(_this) {
      return function() {
        _this.save();
        return _this.$('textarea[name="lesson[answer_array_json]"]').remove();
      };
    })(this));
  };

  LessonAnswerRoot.prototype.field_name = 'answer_options';

  return LessonAnswerRoot;

})(ConceptReviewRoot);

dataLoad = function(cla) {
  var el, _i, _len, _ref, _results;
  _ref = $("*[data-view=\"" + cla + "\"]");
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    _results.push(new window[cla]({
      el: el
    }));
  }
  return _results;
};

loadSeriesRoots = function() {
  dataLoad('ConceptReviewRoot');
  dataLoad('LessonAnswerRoot');
  return dataLoad('RuleExamplesRoot');
};

jQuery(document).on('page:load', loadSeriesRoots);

jQuery(loadSeriesRoots);