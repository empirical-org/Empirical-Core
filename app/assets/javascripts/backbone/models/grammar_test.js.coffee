class PG.Models.GrammarTest extends Backbone.Model
  initialize: ->
    @chunks = new PG.Collections.Chunks

  results: ->
    @chunks.reject (chunk) -> chunk.grade()

  back: (chunk) ->
    front = ''
    cur = chunk.id
    cap = 5

    while cur
      cur--
      cap--
      if cap < 1 then break
      front = @chunks.at(cur).correct() + ' ' + front

    front

  front: (chunk) ->
    back = ''
    cur = chunk.id
    cap = 5

    while cur < (@chunks.length - 1)
      cur++
      cap--
      if cap < 1 then break
      back = back + ' ' + @chunks.at(cur).correct()

    back
