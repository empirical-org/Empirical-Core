class GrammarQuestion
  attr_accessor :error, :answer, :grammar

  def initialize opts
    @error   = opts[:error]  .to_s
    @answer  = opts[:answer] .to_s
    @grammar = opts[:grammar].to_s
  end
end
