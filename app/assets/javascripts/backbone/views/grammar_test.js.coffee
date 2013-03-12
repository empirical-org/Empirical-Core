class PG.Views.GrammarTest extends Backbone.View
  template: JST['backbone/templates/_grammar_test']
  resultsTemplate: JST['backbone/templates/_grammar_test_results']

  events:
    'focus  .edit-word': 'wordFocused'
    'change .edit-word': 'wordChanged'
    'click  .show-results': 'showResults'

  initialize: ->
    # _.bindAll 'render'
    @grammarTest = grammarTests.get(@$el.data('id'))
    @chunks = @grammarTest.chunks
    @questions = @chunks.select (c) -> c.get('answer')
    @render()

  render: ->
    @$('.text').html @template(chunks: @grammarTest.chunks)
    @$('.edit-word').attr 'contentEditable', true
    this

  wordFocused: (e) ->
    # @currentWord = @chunks.get($(e.target).data('id'))
    # console.log @currentWord

  wordChanged: (e) ->
    chunk = @chunks.get($(e.target).data('id'))
    chunk.input = $(e.target)

  showResults: ->
    console.log @resultsTemplate(@grammarTest)
    @$('.results').html @resultsTemplate(@grammarTest)



jQuery ($) ->
  $('.grammar-test').each ->
    new PG.Views.GrammarTest el: this
