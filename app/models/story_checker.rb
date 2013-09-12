class StoryChecker < Score
  attr_accessor :context

  def check_input! input
    input.each do |chunk|
      chunk = Chunk.new(self, chunk)
      # if ( chunk.grade() && chunk.inputPresent() )
      #   {
      #     return $word.addClass('correct');
      #   }
      #   else if ( !chunk.grade() )
      #   {
      #     $word.addClass('error');

      #     if (chunk.grammar)
      #       return missedRules.push(chunk.rule());
      #   }
    end
  end

  def chapter_test
    context.instance_variable_get(:@context)
  end
end
