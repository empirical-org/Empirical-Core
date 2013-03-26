class PG.Models.GrammarRule extends Backbone.Model
  initialize: ->
    @chunks = new PG.Collections.Chunks

  results: ->
    @chunks.reject (chunk) -> chunk.grade()

  correct: ->
    @chunks.map((c) -> c.correct()).join(' ')


