# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_concept_results
#
#  id                  :bigint           not null, primary key
#  created_at          :datetime         not null
#  concept_result_id   :bigint           not null
#  student_response_id :bigint           not null
#
# Indexes
#
#  index_student_response_concept_results_on_concept_result_id    (concept_result_id)
#  index_student_response_concept_results_on_student_response_id  (student_response_id)
#
# Foreign Keys
#
#  fk_rails_...  (concept_result_id => concept_results.id)
#  fk_rails_...  (student_response_id => student_responses.id)
#
class StudentResponseConceptResult < ApplicationRecord
  belongs_to :student_response
  belongs_to :concept_result
end
