require 'spec_helper'

describe GrammarParser do
  before do
    @parser = GrammarParser.new
  end

  it 'fails without question' do
    expect { @parser.parse('This is just some regular text') }.to raise_error(Parslet::ParseFailed)
  end

  it 'succeeds with question' do
    @parser.parse('This is just {+some|-som} regular text')
  end

  it 'fails when empty' do
    expect { @parser.parse('') }.to raise_error(Parslet::ParseFailed)
  end
end
