require 'test_helper'

describe GrammarParser do
  before do
    @parser = GrammarParser.new
  end

  it 'fails without question' do
    assert_raises(Parslet::ParseFailed) do
      @parser.parse('This is just some regular text')
    end
  end

  it 'succeeds with question' do
    @parser.parse('This is just {+some|-som} regular text')
  end

  it 'fails when empty' do
    assert_raises(Parslet::ParseFailed) do
      @parser.parse('')
    end
  end
end
