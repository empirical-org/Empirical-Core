jQuery.postJSON = function( url, data, type ) {
  return jQuery.ajax({
    type: 'POST',
    contentType: 'application/json; charset=UTF-8',
    url: url,
    data: data,
    dataType: type
  });
};

window.PG.Views.ChapterAssessment = Backbone.View.extend({
  template: JST['backbone/templates/chapter_assessment'],

  events: {
    'blur  .edit-word': 'wordChanged',
    'click .show-results': 'showResults'
  }

, initialize: function(options) {
    this.assessment = options.assessment;
    this.rules      = options.rules;
    this.lessons    = options.lessons;
    this.chunks     = this.assessment.chunks;
    this.questions  = this.chunks.select(function(c) { return c.get('answer') });

    this.showStory();
  }

, showPracticeQuestions: function() {
    return this.assessment.get('rule_position');
  }

, showStory: function() {
    this.$('.text').html(
      this.template({ chunks: this.assessment.chunks })
    );

    this.$('.edit-word').attr('contentEditable', true).attr('spellcheck', false);
  }

, wordChanged: function(e) {
    var $word, chunk;
    $word = $(e.target);
    chunk = this.chunks.get($word.data('id'));
    chunk.input = $word.text().trim();

    if (chunk.input === chunk.word || chunk.input === chunk.error) {
      return $word.removeClass('edited');
    } else {
      return $word.addClass('edited');
    }
  }

, showResults: function() {
    var id, _i, _len, _ref1
      , missedRules = []
      , total = this.chunks.select(function(c) { return c.attributes.answer }).length
      , self = this;

    this.$('.edit-word')
      .removeClass('edit-word')
      .addClass('graded-word')
      .each(function(word) {
        var $word = $(this).attr('contentEditable', false)
          , chunk = self.chunks.get($word.data('id'));

        if ( chunk.grade() && chunk.inputPresent() )
        {
          return $word.addClass('correct');
        }
        else if ( !chunk.grade() )
        {
          $word.addClass('error');

          if (chunk.grammar) return missedRules.push(chunk.rule());
        }
      });

    this.$('.show-results').hide();

    $.postJSON(this.$el.data().storyPath, JSON.stringify(this.chunks.toJSON()), 'html')
      .then(function (data) {
        self.$('.grammar-test-results').html(data);
      })
      .fail(function (err) {
        debugger;
      });

    mixpanel.track('story test submitted', {
      chapter_id: this.assessment.get('chapter_id'),
      score:      parseInt(((total - missedRules.length) / total) * 100),
      body:       this.assessment.attributes.body.substring(0, 50)
    });
  }
});
