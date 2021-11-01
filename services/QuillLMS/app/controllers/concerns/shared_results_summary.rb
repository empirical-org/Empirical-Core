module SharedResultsSummary
  extend ActiveSupport::Concern

  NOT_PRESENT = 'Not present'
  NOT_CORRECT = 'Not correct'
  FULLY_CORRECT = 'Fully correct'
  PARTIALLY_CORRECT = 'Partially correct'

  NO_PROFICIENCY = 'No proficiency'
  PARTIAL_PROFICIENCY = 'Partial proficiency'
  PROFICIENCY = 'Proficiency'
  GAINED_PROFICIENCY = 'Gained proficiency'
  MAINTAINED_PROFICIENCY = 'Maintained proficiency'

  extend self

  def data_for_skill_by_activity_session(activity_session_id, skill)
    concept_results = ConceptResult.where(activity_session_id: activity_session_id, concept_id: [skill.concept_ids])
    number_correct = concept_results.select(&:correct?).length
    number_incorrect = concept_results.reject { |cr| cr.correct? }.length
    {
      skill: skill.name,
      number_correct: number_correct,
      number_incorrect: number_incorrect,
      summary: summarize_correct_skills(number_correct, number_incorrect)
    }
  end

  def summarize_correct_skills(number_correct, number_incorrect)
    if number_correct == 0 && number_incorrect == 0
      NOT_PRESENT
    elsif number_correct == 0
      NOT_CORRECT
    elsif number_incorrect == 0
      FULLY_CORRECT
    else
      PARTIALLY_CORRECT
    end
  end
end
