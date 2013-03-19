class PG.Models.Chunk extends Backbone.Model
  initialize: (options) ->
    @word = options.word
    @error = options.error
    @answer = options.answer
    @grammar = options.grammar

  grade: ->
    if @inputPresent() && @correct() == @input
      true
    else if !@inputPresent() && @word
      true
    else
      false

  correct: ->
    if @answer then @answer else @word

  inputPresent: ->
    _.isString(@input) && (@input != @word)

  wordDif: (dir) ->
    diffString(@input || @error, @correct())

  rule: ->
    grammarRules.get(@grammar)

  # difference: (good, bad)
  #   cur = 0
  #   while good.length <= cur && good.length <= cur
  #     g = good[cur]
  #     b = bad[cur]
  #     if g.toLowerCase() != b.toLowerCase()
  #     cur--
