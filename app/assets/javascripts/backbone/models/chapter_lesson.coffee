class PG.Models.ChapterLesson extends Backbone.Model
  initialize: ->
    @chunks = new PG.Collections.Chunks

  rule: ->
    chapterRules.get(@attributes.rule_id)

  correct: ->
    @chunks.map((c) -> c.correct()).join(' ')
