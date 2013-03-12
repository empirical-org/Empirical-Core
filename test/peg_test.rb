require 'rubygems'
require 'parslet'
require 'pry'
require File.expand_path('../../app/models/grammar_parser.rb', __FILE__)

# require 'minitest/autorun'
# describe GrammarParser do
#   before do
#     @parser = GrammarParser.new
#   end

#   it 'parses plain text' do
#     @parser.parse('This is just some regular text')
#   end

#   it 'fails when empty' do
#     assert_raises(Parslet::ParseFailed) do
#       @parser.parse('')
#     end
#   end

#   it 'stops at brackets' do
#   end
# end


# puts @parser.parse('what {')


def parse(str)
  mini = GrammarParser.new

  mini.parse(str)
rescue Parslet::ParseFailed => failure
  puts failure.cause.ascii_tree
end

puts        ARGV.join(' ')
res = parse ARGV.join(' ')
puts res.inspect
