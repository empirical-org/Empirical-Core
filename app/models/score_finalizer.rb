class ScoreFinalizer
  delegate :practice_lesson_input, :review_lesson_input, :assignment,
           :missed_rules, :score_values, to: :@score

  def initialize score
    @score = score
  end

  def results
    {
      practice_percentage: grade_lessons(:practice),
      story_percentage:    1 - missed_rules.length.to_f / story_rule_ids.length,
      review_percentage:   grade_lessons(:review)
    }
  end

  private

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
    assignment.chapter.assessment.chunks.select{ |c| c.is_a?(GrammarQuestion) }.map(&:grammar).uniq
  end
end