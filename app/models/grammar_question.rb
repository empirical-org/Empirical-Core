class GrammarQuestion
  attr_accessor :error, :answer, :grammar
  delegate :[], to: :@options

  def initialize opts
    @options = opts
    @error   = opts[:error]  .to_s
    @answer  = opts[:answer] .to_s
    @grammar = opts[:grammar].to_s
  end

  def rule
    Rule.find(@grammar)
  end
end
