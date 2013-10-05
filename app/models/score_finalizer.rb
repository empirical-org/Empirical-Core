class ScoreFinalizer
  delegate :chapter, :missed_rules, :score_values,
           :inputs, to: :@score

  def initialize score
    @score = score
  end

  def results
    {
      questions_percentage:  grade_lessons,
      story_missed_count:   story_missed_count,
      story_total_count:    story_total_count,
      mistakes_found_count: mistakes_found_count
    }
  end

  private

  def story_missed_count
    missed_rules.length
  end

  def mistakes_found_count
    story_total_count - story_missed_count
  end

  def story_total_count
    story_rule_ids.length
  end

  def grade_lessons
    inputs.map(&:score).inject(:+) / inputs.count
  end

  def story_rule_ids
    chapter.assessment.chunks.select{ |c| c.is_a?(GrammarQuestion) }.map(&:grammar).uniq
  end
end