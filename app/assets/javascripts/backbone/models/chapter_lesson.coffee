class PG.Models.ChapterLesson extends Backbone.Model
  initialize: ->
    @answers = new PG.Collections.Chunks

  rule: ->
    chapterRules.get(@attributes.rule_id)

  correct: (input) ->
    @answers.any (a) -> a.text.trim() == input.trim()
