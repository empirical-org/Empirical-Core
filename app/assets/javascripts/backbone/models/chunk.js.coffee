class PG.Models.Chunk extends Backbone.Model
  initialize: (options) ->
    @word = options.word
    @error = options.error
    @answer = options.answer
    @grammar = options.grammar
    @text = options.text

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
    #@ruleId = @lesson().attributes.rule_id
    chapterRules.get(@grammar)

  css_class: -> "edit-word#{if $.trim(@word) == '' then ' non-editable' else ''}"

  toJSON: ->
    json =
      word:    @word
      error:   @error
      answer:  @answer
      grammar: @grammar
      text:    @text
      input:   @input
      id:      @attributes.id

