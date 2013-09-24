require 'test_helper'

describe GrammarParser do
  before do
    @parser = GrammarParser.new
  end

  it 'parses plain text' do
    @parser.parse('This is just some regular text')
  end

  it 'fails when empty' do
    assert_raises(Parslet::ParseFailed) do
      @parser.parse('')
    end
  end
end
