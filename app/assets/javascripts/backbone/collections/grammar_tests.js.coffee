class PG.Collections.GrammarTests extends Backbone.Collection
  model: PG.Models.GrammarTest
  url: -> "/grammar_tests.json"

window.grammarTests = new PG.Collections.GrammarTests