class ScoreFinalizer
  delegate :practice_lesson_input, :review_lesson_input, :chapter,
           :missed_rules, :score_values, to: :@score

  def initialize score
    @score = score
  end

  def results
    {
      practice_percentage:  grade_lessons(:practice),
      story_percentage:     1 - story_missed_count.to_f / story_total_count,
      review_percentage:    grade_lessons(:review),
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

  def grade_lessons(step)
    # lesson_input = send(:"#{step}_lesson_input")

    # missed_lessons = lesson_input.reject do |lesson_id, input|
    #   begin
    #     Lesson.find(lesson_id).answers.reject{ |a| a.strip == input.strip }.empty?
    #   rescue ActiveRecord::RecordNotFound
    #     next
    #   end
    # end

    # (lesson_input.keys - missed_lessons.keys).length.to_f / lesson_input.length
  end

  def story_rule_ids
    chapter.assessment.chunks.select{ |c| c.is_a?(GrammarQuestion) }.map(&:grammar).uniq
  end
end