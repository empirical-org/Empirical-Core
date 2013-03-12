class GrammarParser < Parslet::Parser
  # question parser
  rule(:open_d)    { str('{') }
  rule(:close_d)   { str('}') }
  rule(:error_d)   { str('-') }
  rule(:answer_d)  { str('+') }
  rule(:grammar_d) { str('|') }
  rule(:question)  { (open_d >> arg.repeat >> close_d) }

  rule(:error)   { error_d   >> arg_val.as(:error)   }
  rule(:answer)  { answer_d  >> arg_val.as(:answer)  }
  rule(:grammar) { grammar_d >> arg_val.as(:grammar) }

  rule(:arg) { error | answer | grammar }
  rule(:arg_val) {
    (
      (
        open_d   |
        close_d  |
        error_d  |
        answer_d |
        grammar_d
      ).absent? >> any
    ).repeat
  }

  # basic text
  rule(:text) { ((open_d | close_d).absent? >> any).repeat }

  # util
  rule(:eof) { any.absent? }
  rule(:exp) {
    (
      text.maybe.as(:before)   >>
      question  .as(:question) >>
      text.maybe.as(:after)
    ).repeat(1).as(:questions)
  }
  root :exp
end
