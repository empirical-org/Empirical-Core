class StoryChecker < Score
  attr_accessor :context
  attr_reader :chunks

  def check_input! input
    @chunks = input.map { |c| Chunk.new(chapter, c) }.each(&:grade!)
    self.missed_rules = chunks.select { |c| c.state == :missed }.map { |c| c.rule.id }
    save!
  end

  def chapter_test
    context.instance_variable_get(:@context)
  end

  def title
    if (found = sections.find{ |s| s.section == :found }.results).any?
      "You Found #{found.count} #{'Error'.pluralize(found.count)}!"
    else
      "You didn't find any errors."
    end
  end

  def sections
    [:missed, :found, :introduced].map { |s| Section.new(self, s) }
  end

  class Chunk < ::Chunk
    def highlighted_word
      if state == :missed
        correct
      else
        input
      end
    end
  end

  class Section
    attr_reader :checker, :section
    delegate :chunks, to: :checker

    def initialize checker, section
      @checker = checker
      @section = section
    end

    def results
      chunks.select { |c| c.state == section }
    end

    def title
      "#{results.count} #{title_word} #{'Problem'.pluralize(results.count)}"
    end

    def css_class
      section.to_s
    end

    def title_word
      case section
      when :missed     then 'Unsolved'
      when :found      then 'Solved'
      when :introduced then 'Introduced'
      else
        raise "invalid section type: #{section.inspect}"
      end
    end
  end
end
