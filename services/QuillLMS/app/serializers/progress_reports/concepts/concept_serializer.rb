# frozen_string_literal: true

class ProgressReports::Concepts::ConceptSerializer  < ApplicationSerializer
  attributes :concept_name,
             :concept_id,
             :total_result_count,
             :correct_result_count,
             :incorrect_result_count,
             :level_2_concept_name,
             :percentage

  def percentage
    (object.correct_result_count.to_f * 100 / object.total_result_count).round
  end
end
